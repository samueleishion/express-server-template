'use strict';

const Generator = require('yeoman-generator');
const Log = require('../../../../bin/log');
const log = new Log();

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    this.option('skip', {
      desc: 'Skips the welcome message',
      type: Boolean
    });
  }

  prompting() {
    const done = this.async();
    let prompts = [
      {
        type: 'input',
        name: 'modelName',
        message: 'Model name: '
      },
      {
        type: 'input',
        name: 'modelEndpoint',
        message: 'Model main endpoint: /api/'
      },
      {
        type: 'input',
        name: 'modelCollection',
        message: 'Model db collection: '
      }
    ];

    this.prompt(prompts).then((answers) => {
      this.modelName = answers.modelName;
      this.modelEndpoint = answers.modelEndpoint;
      this.modelCollection = answers.modelCollection;
      // Kebab case to Pascal case
      this.modelUppercase = answers.modelName
        .split('-')
        .map(x=> x.charAt(0).toUpperCase() + x.slice(1).toLowerCase(1))
        .join('');
      done();
    });
  }

  validation() {
    const _validate = (str) => !str || str.length <= 0;

    if (_validate(this.modelName)) {
      log.error('You must specify a model name.');
      process.exit();
    }

    if (_validate(this.modelEndpoint)) {
      log.error('You must specify model endpoint.');
      process.exit();
    }

    if (_validate(this.modelCollection)) {
      log.error('You must specify model db collection.');
      process.exit();
    }

    log.success('Validation passed');
  }

  writing() {
    const copyFiles = ['index.js'];


    for (let file of copyFiles) {
      let ext = file.split('.')[file.split('.').length - 1];
      let dest = `./src/models/${this.modelName}.${ext}`;

      log.info(`Copying ${file} to ${dest}`);
      this.fs.copyTpl(
        this.templatePath(file),
        this.destinationPath(dest),
        {
          modelName: this.modelName,
          modelEndpoint: this.modelEndpoint,
          modelCollection: this.modelCollection,
          modelUppercase: this.modelUppercase
        }
      );
    }
  }

  end() {
    log.success(`Generated ${this.modelName} model!`);
  }
};
