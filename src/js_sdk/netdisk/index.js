export function checkFileType (name) {
  let type = ''
  name = name.toLowerCase()
  if (/\.(mkv|mp4|webm|avi|mpg|mpeg|rm|rmvb|mov|wmv|asf|ts|flv)$/.test(name)) {
    type = 'video'
  } else if (/\.(wav|mp3|ogg|acc|m4a|flac|aac)$/.test(name)) {
    type = 'audio'
  } else if (/\.(rar|zip)$/.test(name)) {
    type = 'archive'
  } else if (/\.(png|jpg|jpeg|gif|bmp|svg)$/.test(name)) {
    type = 'image'
  } else if (/\.pdf$/.test(name)) {
    type = 'pdf'
  } else if (/\.(excel|xls|csv|xlsx)$/.test(name)) {
    type = 'excel'
  } else if (/\.(ppt|pptx)$/.test(name)) {
    type = 'powerpoint'
  } else if (/\.(doc|docx)$/.test(name)) {
    type = 'word'
  } else if (/\.(c|cpp|java|js|py|css|html|php|ipynb)$/.test(name)) {
    type = 'code'
  } else if (/\.(txt|text)$/.test(name)) {
    type = 'text'
  } else {
    type = 'other'
  }
  return type
}

export function formatSize (size) {
  let result
  // size为字节
  if (size / 1024 / 1024 / 1024 >= 1) {
    // 可以转化为GB就转化为GB
    result = (size / 1024 / 1024 / 1024).toFixed(2) + 'GB'
  } else if (size / 1024 / 1024 >= 1) {
    // 可以转化为MB就转化为MB
    result = (size / 1024 / 1024).toFixed(2) + 'MB'
  } else {
    // 否则转化为KB
    result = (size / 1024).toFixed(2) + 'KB'
  }
  return result
}
