pipeline {
    agent any
    environment {
        BRANCH_NAME = "${GIT_BRANCH.split("/")[1]}"
        DOCKER_HUB_URL="lambro2510"
        RESPOSITORY="lambro2510"
        DOCKER_HUB_TOKEN=credentials("docker_hub_token")
        NAME="salepage-cms-frontend"
        PORT="32001"
    }
    stages {
            stage('Build') {
                steps {
                    script {
                      sh "sudo docker build -t ${RESPOSITORY}/${NAME}:${BUILD_NUMBER} ."
                    }
                }
            }

            stage('Push') {
                steps {
                    script {
                      sh "sudo docker login --username=${RESPOSITORY} --password=${DOCKER_HUB_TOKEN} docker.io"
                      sh "sudo docker tag ${RESPOSITORY}/${NAME}:${BUILD_NUMBER} ${RESPOSITORY}/${NAME}:latest"
                      sh "sudo docker push ${RESPOSITORY}/${NAME}:${BUILD_NUMBER}"
                      sh "sudo docker push ${RESPOSITORY}/${NAME}:latest"
                    }
                }
            }
        }
}
