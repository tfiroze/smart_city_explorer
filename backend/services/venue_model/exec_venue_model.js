const { execSync } = require('child_process');

function executeIPythonNotebook(ipynbFileName, parameters) {
  try {
    // 若为.ipynb，则执行接下来两步。若为py，则跳过接下来两步
    // 1. 将 .ipynb 文件转换为可执行的脚本
    execSync(`jupyter nbconvert --to script ${ipynbFileName}`);

    // 2. 获取生成的脚本文件名
    const scriptFileName = ipynbFileName.replace('.ipynb', '.py');

    // 构建执行脚本的命令，包括传递的参数
    const command = `python ${scriptFileName} ${parameters.join(' ')}`;

    // 执行 Python 脚本并获取结果
    const result = execSync(command, { encoding: 'utf8' });

    return result.trim();
  } catch (err) {
    console.error('ERROR:', err.message);
    return null;
  }
}

let getRecommendVenues = (req, res) => {
  // 示例用法，ipynbFileName 设置为文件名 'test.ipynb'，因为它与 Node.js 文件在同一个文件夹下
  const ipynbFileName = 'services/venue_model/recommendation_model.ipynb';

  // 可选的传入参数:
  // {
  //    user_zone_input: Upper_Manhattan, Midtown_Manhattan, Upper_West_Side, Upper_East_Side, Lower_Manhattan, Other
  //    user_input_attractions: Nature_Attractions, Shopping_Center, Tourist_Destination, Cultural_Heritage, Neighborhood_Market, Fashion_Convenience, Library, Scenic_Landmarks, Art, Religious, Park, Gifts_&_Souvenirs
  // }
  
  // For example of input: 
  // let user_zone_input = ["Upper_West_Side", "Upper_East_Side"]
  // let user_input_attractions = ["Neighborhood_Market"]

  user_zone_input = req.body.user_zone_input.replace(/'/g, '"'); 
  user_input_attractions = req.body.user_input_attractions.replace(/'/g, '"'); 

  const parameters = [JSON.parse(user_zone_input), JSON.parse(user_input_attractions)];

  // 返回一个字符串,转换为json
  const result = executeIPythonNotebook(ipynbFileName, parameters);
  const str_res = result.replace(/'/g, '"').replace(/\(/g, '[').replace(/\)/g, ']')
  let json_res = JSON.parse(str_res)
  console.log(json_res)
}

module.exports = {
  getRecommendVenues
}