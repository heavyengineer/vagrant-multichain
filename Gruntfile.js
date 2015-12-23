module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        watch: {
            playbook: {
                files: ['ansible_provision/**/*.yml'],
                tasks: ['default'],
                options: {
                    spawn: false,
                }
            },
        },
      }
    )

    var shell = require('shelljs');

grunt.registerTask('default', function(){
    shell.exec('vagrant provision');
});

grunt.loadNpmTasks('grunt-contrib-watch');

  };
