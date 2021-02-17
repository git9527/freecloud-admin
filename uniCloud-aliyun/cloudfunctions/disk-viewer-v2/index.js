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
  const queryFolderId = JSON.parse(event.body).currentFolderId
  const currentFolderId = queryFolderId || siteInfo.fileRootId
  console.log('id in query:', queryFolderId, 'restricted top:', siteInfo.fileRootId)
  const parentNodes = await getParentNodes(currentFolderId, siteInfo.fileRootId)
  console.log('query files in folder:', currentFolderId, parentNodes)
  const selfNode = parentNodes[parentNodes.length - 1]
  console.log('self node is:', selfNode)
  const whereClause = {
    parent: selfNode.id
  }
  const resp = await uniCloud.database().collection('opendb-netdisk-files').where(whereClause).orderBy("isFolder", "desc").orderBy("createOn","desc").get()
  //返回数据给客户端
  return {
    code: 0,
    data: {
      paths: parentNodes,
      files: resp.data,
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

async function getParentNodes(sourceId, topRoot) {
  const nodes = []
  const sourceResp = await uniCloud.database().collection('opendb-netdisk-files').doc(sourceId).get()
  const sourceNode = sourceResp.data[0]
  nodes.push({
    name: sourceId === topRoot ? '' : sourceNode.name,
    id: sourceNode._id,
    isFolder: sourceNode.isFolder
  })
  if (sourceId === topRoot) {
    return nodes
  }
  let parentId = sourceNode.parent
  while (parentId) {
    const parentResp = await uniCloud.database().collection('opendb-netdisk-files').doc(parentId).get()
    const parentNode = parentResp.data[0]
    nodes.splice(0, 0, {
      name: parentNode._id === topRoot ? '' : parentNode.name,
      id: parentNode._id,
      isFolder: parentNode.isFolder
    })
    if (parentNode._id === topRoot) {
      break
    } else {
      parentId = parentNode.parent
    } 
  }
  return nodes
}


