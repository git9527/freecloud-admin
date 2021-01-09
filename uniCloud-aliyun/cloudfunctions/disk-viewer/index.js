'use strict';
exports.main = async (event, context) => {
	//event为客户端上传的参数
  const siteInfos = await getSiteInfoFromOrigin(event)
  if (siteInfos.length === 0) {
    return {
      code: -1,
      message: '非法请求'
    }
  }
  const siteInfo = siteInfos[0]
  delete siteInfo.siteOrigin
  delete siteInfo._id
	const pathArray = JSON.parse(event.body).parent.split('/')
  console.log('query file in parent:', pathArray)
  const pathStack = []
  let parentId = siteInfo.fileRootId
  for (const folder of pathArray) {
    if (!folder) {
      console.log('skip the starting empty folder,  as its id is:',  parentId)
      pathStack.push({
        name: folder,
        id: parentId,
        isFolder: true
      })
      continue
    }
    const whereClause = {
      parent: parentId,
      name: folder
    }
    const resp = await uniCloud.database().collection('opendb-netdisk-files').where(whereClause).orderBy("isFolder", "desc").orderBy("createOn","desc").get()
    const folderInfo = resp.data
    if (folderInfo.length > 0) {
      parentId = folderInfo[0]._id
      pathStack.push({
        name: folder,
        id: parentId,
        isFolder: folderInfo[0].isFolder
      })
    } else {
      console.error('path not exist when query folder:[', folder, '], parent id:', parentId)
      return {
        code: '-2',
        message: '路径不存在'
      }
    }
  }
  const lastPath = pathStack.slice(-1).pop()
  let files = []
  if (lastPath.isFolder) {
    const whereClause = {
      parent: lastPath.id
    }
    const resp = await uniCloud.database().collection('opendb-netdisk-files').where(whereClause).orderBy("isFolder", "desc").orderBy("createOn","desc").get()
    files = resp.data
  }
	//返回数据给客户端
	return {
    code: 0,
    data: {
      paths: pathStack,
      files: files,
      siteInfo: siteInfo
    }
  }
};

async function getSiteInfoFromOrigin(event) {
  const origin = event.headers.origin
  const resp = await uniCloud.database().collection('opendb-netdisk-sites').where({
    siteOrigin: new RegExp(origin)
  }).get()
  return resp.data
}


