node {
  def DOCKER_REGISTRY = 'http://177.44.248.70:5000'

  stage('Checkout repository') {
    git branch: 'main', url: 'https://github.com/wolmeister/expenser.git'
  }

  stage('Install dependencies') {
    sh 'pnpm install'
  }

  stage('Build and publish') {
    parallel([
      'API': {
        def image;

        stage('Build') {
          sh 'echo Build'
        }
        stage('Test') {
          sh 'echo test'
        }
        stage('Bake image') {
          image = docker.build("expenser-api", "./packages/api")
        }
        stage('Publish image') {
          docker.withRegistry(DOCKER_REGISTRY) {
            image.push 'latest'
          }
        }
      },
      'WEB': {
        def image;
        
        stage('Build') {
          sh 'echo Build'
        }
        stage('Test') {
          sh 'echo test'
        }
        stage('Bake image') {
          image = docker.build("expenser-web", "./packages/web")
        }
        stage('Publish image') {
          docker.withRegistry(DOCKER_REGISTRY) {
            image.push 'latest'
          }
        }
      }
    ])
  }

  stage('Deploy') {
    build job: 'expenser-staging-deploy'
  }
}
