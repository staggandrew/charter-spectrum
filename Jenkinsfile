pipeline {
  agent none
  stages {
    stage('Fetch Dependencies') {
        agent {
         docker { 
           image 'node:latest' 
         }
       }
      environment {
        HOME = '.'
      }
      steps {
        sh "npm install"
        sh "npm run-script build"
        stash includes: 'build/', name: 'build'
      }
    }
    stage("Build Image & Push") {
      agent any
      steps {
        unstash 'build'
        sh "docker build -t charter:${env.GIT_COMMIT} ."
        sh "docker push charter:${env.GIT_COMMIT}"
      }
    }
  }
}

