'use strict';
exports.main = async (event, context) => {
	//event为客户端上传的参数
  const siteInfos = await getSiteInfoFromOrigin(event)
  if (siteInfos.length === 0) {
    return {
      code: -1,
      message: '非法请求-1'
    }
  }
  const siteInfo = siteInfos[0]
  delete siteInfo.siteOrigin
  delete siteInfo._id
  const originQueryId = JSON.parse(event.body).id
  const queryId =  originQueryId || siteInfo.fileRootId
  const queryFileInfo = await getInfoById(queryId)
  const currentFolderId = queryFileInfo.isFolder ? queryId : queryFileInfo.parent
  console.log('id in query:', originQueryId, 'restricted top:', siteInfo.fileRootId)
  const parentNodes = await getParentNodes(currentFolderId, siteInfo.fileRootId)
  console.log('query files in folder:', currentFolderId, parentNodes)
  if (parentNodes.length === 0) {
    return {
      code: -2,
      message: '非法请求-2'
    } 
  }
  console.log('self node is:', currentFolderId)
  const whereClause = {
    parent: currentFolderId
  }
  const resp = await uniCloud.database().collection('opendb-netdisk-files').where(whereClause).orderBy("isFolder", "desc").orderBy("name","asc").get()
  //返回数据给客户端
  return {
    code: 0,
    data: {
      paths: parentNodes,
      files: resp.data,
      siteInfo: siteInfo,
      targetIsFile: !queryFileInfo.isFolder
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
  if (!sourceNode) {
    return nodes
  }
  nodes.push({
    name: sourceId === topRoot ? '' : sourceNode.name,
    id: sourceId === topRoot ? '' : sourceNode._id,
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
      id: parentNode._id === topRoot ? '' : parentNode._id,
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

async function getInfoById(sourceId) {
  const sourceResp = await uniCloud.database().collection('opendb-netdisk-files').doc(sourceId).get()
  return sourceResp.data[0]
}


