// Syntax check with this command line
// curl -k -X POST -F "jenkinsfile=<Jenkinsfile" https://ci.rssw.eu/pipeline-model-converter/validate

pipeline {
  agent { label 'Linux-Office03' }
  options {
    disableConcurrentBuilds()
    skipDefaultCheckout()
    timeout(time: 20, unit: 'MINUTES')
    buildDiscarder(logRotator(numToKeepStr: '10'))
  }
  stages {
    stage('Checkout') {
      steps {
        checkout([$class: 'GitSCM', branches: scm.branches, extensions: scm.extensions + [[$class: 'CleanCheckout']], userRemoteConfigs: scm.userRemoteConfigs])
      }
    }

    stage('Dependencies') {
      steps {
        script {
          def cablVersion = "3.0.0"
          def prgsRulesVersion = "3.0.1"
          def slintlsVersion = "3.17.99001"
          withEnv(["MVN_HOME=${tool name: 'Maven 3', type: 'hudson.tasks.Maven$MavenInstallation'}", "JAVA_HOME=${tool name: 'JDK17', type: 'jdk'}"]) {
            sh "mkdir analyzers server resources"
            sh "$MVN_HOME/bin/mvn -U -B -ntp dependency:get -Dartifact=eu.rssw.sonar.openedge:sonar-openedge-plugin:${cablVersion} -Dtransitive=false && cp $HOME/.m2/repository/eu/rssw/sonar/openedge/sonar-openedge-plugin/${cablVersion}/sonar-openedge-plugin-${cablVersion}.jar analyzers/sonaroe.jar"
            sh "$MVN_HOME/bin/mvn -U -B -ntp dependency:get -Dartifact=eu.rssw.sonar.openedge:progress-rules-plugin:${prgsRulesVersion} -Dtransitive=false && cp $HOME/.m2/repository/eu/rssw/sonar/openedge/progress-rules-plugin/${prgsRulesVersion}/progress-rules-plugin-${prgsRulesVersion}.jar analyzers/progress.jar"
            sh "$MVN_HOME/bin/mvn -U -B -ntp dependency:get -Dartifact=org.sonarsource.sonarlint.ls:sonarlint-language-server:${slintlsVersion} -Dtransitive=false && cp $HOME/.m2/repository/org/sonarsource/sonarlint/ls/sonarlint-language-server/${slintlsVersion}/sonarlint-language-server-${slintlsVersion}.jar server/sonarlint-ls.jar"
            // Curl -L in order to follow redirects
            // sh "curl -s -L -o resources/jre-windows.zip https://github.com/adoptium/temurin21-binaries/releases/download/jdk-21.0.3%2B9/OpenJDK21U-jre_x64_windows_hotspot_21.0.3_9.zip"
            // sh "curl -s -L -o resources/jre-linux.tar.gz https://github.com/adoptium/temurin21-binaries/releases/download/jdk-21.0.3%2B9/OpenJDK21U-jre_x64_linux_hotspot_21.0.3_9.tar.gz"
          }
        }
      }
    }

    stage('Build') { 
      agent {
        docker {
          image 'node:20'
          args "-v ${tool name: 'SQScanner4', type: 'hudson.plugins.sonar.SonarRunnerInstallation'}:/scanner -e HOME=."
          reuseNode true
        }
      }
      steps {
        script {
          withSonarQubeEnv('RSSW2') {
            sh 'node --version && npm install webpack'
            sh 'npm run compile'
            sh 'npm run webpack'
            // sh 'npm run cyclonedx-run -- --output-file sonarlint-vscode-4.5.1.sbom-cyclonedx.json'
            sh 'npx @vscode/vsce package'
            // sh 'unzip -q resources/jre-windows.zip && mv jdk-21.0.3+9-jre jre'
            // sh 'npx @vscode/vsce package --target win32-x64'
            // sh 'rm -rf jre/ && tar xfz resources/jre-linux.tar.gz && mv jdk-21.0.3+9-jre jre'
            // sh 'npx @vscode/vsce package --target linux-x64'
          }
          archiveArtifacts artifacts: '*.vsix'
        }
      }
    }           
  }

  post {
    failure {
      script {
        mail body: "Check console output at ${BUILD_URL}/console", to: "g.querret@riverside-software.fr", subject: "sonarlint-vscode build failure in Jenkins - Branch ${BRANCH_NAME}"
      }
    }
    fixed {
      script {
        mail body: "Console output at ${BUILD_URL}/console", to: "g.querret@riverside-software.fr", subject: "sonarlint-vscode build is back to normal - Branch ${BRANCH_NAME}"
      }
    }
  }
}
