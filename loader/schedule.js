const schedule = require('node-schedule');

const Loader = require('./loader');

class ScheduleLoader extends Loader {
  constructor(SchedulePath) {
    super();
    this.loadFiles(SchedulePath).forEach((filepath) => {
      console.log(filepath);
      const scheduleConfig = require(filepath);
      if (!scheduleConfig.interval || !scheduleConfig.handler) {
        throw new Error(`${filepath}定时任务配置错误，缺少必要属性 interval 或者 handler`);
      }
      schedule.scheduleJob(scheduleConfig.interval, scheduleConfig.handler);
    });
  }
}

module.exports = ScheduleLoader;
