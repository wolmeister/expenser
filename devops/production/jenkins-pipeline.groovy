node {
  def DOCKER_REGISTRY = 'http://177.44.248.70:5000'

  stage('Checkout repository') {
    git branch: 'production', url: 'https://github.com/wolmeister/expenser.git'
  }

  stage('Install dependencies') {
    sh 'pnpm install'
  }

  stage('Build and publish') {
    parallel([
      'API': {
        def image;

        stage('Build') {
          sh 'pnpm run api build'
        }
        stage('Test') {
          sh 'pnpm run api test'
        }
        stage('Bake image') {
          image = docker.build("expenser-api", "./packages/api")
        }
        stage('Publish image') {
          docker.withRegistry(DOCKER_REGISTRY) {
            image.push 'stable'
          }
        }
      },
      'WEB': {
        def image;
        
        stage('Build') {
          sh 'pnpm run web build'
        }
        stage('Test') {
          sh 'pnpm run web test'
        }
        stage('Bake image') {
          image = docker.build("expenser-web", "./packages/web")
        }
        stage('Publish image') {
          docker.withRegistry(DOCKER_REGISTRY) {
            image.push 'stable'
          }
        }
      }
    ])
  }

  stage('Deploy') {
    build job: 'expenser-production-deploy'
  }
}
