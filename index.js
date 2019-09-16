const path = require('path');
const fs = require('fs');
const argv = require('yargs')
.usage('Usage: $0 -i [./folder/to/json/] -o [./folder/to/yaml/]')
.demandOption(['i', 'o'])
.alias('i', 'input')
.alias('o', 'output').argv;
const clc = require('cli-color');
const swgr = require('swagger-merger');

//config
const config = {
  input: argv.input,
  output: checkDirExist(argv.output),
  errors: []
};

function getListFiles(dirPath) {
  const absolutePath = path.resolve(__dirname, dirPath);
  let filesList = fs.readdirSync(absolutePath);
  filesList = filesList.filter(function (e) {
    return path.extname(e).toLowerCase();
  });
  return filesList;
}

function checkDirExist(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath);
  }
  return dirPath;
}

function convertJsonToYaml(inputPath, outputPath, item) {
  const input = inputPath + item;
  const output = outputPath + item.replace('.json', '.yaml');
  
  console.log('Input file: ', input);
  try {
    swgr.mergerYAML({
      input: input,
      output: output
    });
    console.log(clc.green('Output file: ', output));
  } catch (error) {
    console.log(clc.red('========================='));
    console.log(clc.red('Faild to Output file: ', output));
    console.log(clc.red('Error: ', error));
    console.log(clc.red('========================='));
    config.errors.push(item + ': ' + error);
  }
  
}

function runConverter(config) {
  const listFiles = getListFiles(config.input);
  console.log('index.js:53', listFiles);
  listFiles.forEach(item => {
    convertJsonToYaml(config.input, config.output, item);
  });
}

runConverter(config);
console.log('---------------------');
if (config.errors.length <= 0) {
  console.log(clc.green('All files from ' + config.input + ' successfully converted to ' + config.output));
} else {
  console.log(clc.red('List errors: '));
  config.errors.forEach(item => {
    console.log(clc.red('- ', item));
  })
}
