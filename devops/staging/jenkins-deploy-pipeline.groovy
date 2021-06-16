node {
  def STACK_YAML_URL = "https://raw.githubusercontent.com/wolmeister/expenser/main/devops/staging/docker-stack.yaml"

  sshagent(credentials: ['staging-ssh']) {
    stage('Update secrets') {
      withCredentials([
        string(credentialsId: 'staging-db-user', variable: 'DB_USER'),
        string(credentialsId: 'staging-db-password', variable: 'DB_PASSWORD'),
        string(credentialsId: 'staging-jwt-secret', variable: 'JWT_SECRET')
      ]) {
        sh '''
          ssh -t univates@177.44.248.70 '
          export DB_USER='"'$DB_USER'"';
          export DB_PASSWORD='"'$DB_PASSWORD'"';
          export JWT_SECRET='"'$JWT_SECRET'"';
          echo -n $DB_USER | sudo tee /opt/expenser/staging/db-user.txt > /dev/null;
          echo -n $DB_PASSWORD | sudo tee /opt/expenser/staging/db-password.txt > /dev/null;
          echo -n $JWT_SECRET | sudo tee /opt/expenser/staging/jwt-secret.txt > /dev/null;
          '   
        '''
      }
    }

    stage('Update docker-stack.yaml') {
      sh "ssh -t univates@177.44.248.70 'sudo wget ${STACK_YAML_URL} -P /opt/expenser/staging'"
    }

    stage('Deploy') {
      sh '''
        ssh -t univates@177.44.248.70 '
        sudo docker stack deploy -c /opt/expenser/staging/docker-stack.yaml expenser-staging
        '   
      '''
    }
  }
}
