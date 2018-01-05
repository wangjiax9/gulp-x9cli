const fs = require('fs')
const path = require('path')

// 入口文件
const entryFiles = {}
const baseDir = './src/app'


function scanDir(baseDir){
    let fileList = fs.readdirSync(baseDir)
    fileList.forEach(file => {
        const filePath = `${baseDir}/${file}`
        analyzeFile(fs.readdirSync(filePath), filePath)
    })
}
function analyzeFile(fileList, dir){
    try {
        fileList.forEach(file => {
            const filePath = `${dir}/${file}`
            const stat = fs.statSync(filePath)
            if(stat.isFile()){
                if(path.extname(filePath) == '.js'){
                    const p = path.parse(filePath);
                    const reg = new RegExp(baseDir+'\/?','g')
                    const fileName = p.dir.replace(reg,'')+'/'+p.name;
                    entryFiles[fileName] = path.resolve(__dirname, filePath)
                }
            }else{
                
            }
        })
    } catch (e) {
        throw new Error(e)
    }
}
scanDir(baseDir)
module.exports = entryFiles
console.log(entryFiles)