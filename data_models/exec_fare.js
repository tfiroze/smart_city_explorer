const { spawn } = require('child_process');

// 定义Python脚本路径和参数
const pythonScriptPath = 'test.py';
const args = [1, 2];

// 调用Python脚本
const pythonProcess = spawn('python', [pythonScriptPath, ...args]);

// 监听Python脚本的输出
pythonProcess.stdout.on('data', (data) => {
  const output = data.toString();
  console.log('Python脚本的输出:', output);
});

// 监听Python脚本的错误输出
pythonProcess.stderr.on('data', (data) => {
  const error = data.toString();
  console.error('Python脚本的错误输出:', error);
});

// 监听Python脚本的退出事件
pythonProcess.on('close', (code) => {
  console.log(`Python脚本已退出, 退出码:${code}`);
});
