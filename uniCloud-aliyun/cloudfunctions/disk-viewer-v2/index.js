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
  const currentFolderId = JSON.parse(event.body).currentFolderId || siteInfo.fileRootId
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
  const selfResp = await uniCloud.database().collection('opendb-netdisk-files').doc(sourceId).get()
  const selfNode = selfResp.data[0]
  nodes.push({
    name: selfNode.name,
    id: selfNode._id,
    isFolder: selfNode.isFolder
  })
  let parentId = selfNode.parent
  while (parentId && parentId !== topRoot) {
    const nodeResp = await uniCloud.database().collection('opendb-netdisk-files').doc(parentId).get()
    const node = nodeResp.data[0]
    parentId = node.parent
    nodes.splice(0, 0, {
      name: node.name,
      id: node._id,
      isFolder: node.isFolder
    })
  }
  return nodes
}


