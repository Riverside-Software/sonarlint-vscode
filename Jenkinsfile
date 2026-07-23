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
          def cablVersion = "3.8.1"
          def prgsRulesVersion = "3.8.0"
          def slintlsVersion = "5.5.99001"
          withEnv(["MVN_HOME=${tool name: 'Maven 3', type: 'hudson.tasks.Maven$MavenInstallation'}", "JAVA_HOME=${tool name: 'JDK17', type: 'jdk'}"]) {
            sh "mkdir analyzers server"
            sh "$MVN_HOME/bin/mvn -U -B -ntp dependency:get -Dartifact=eu.rssw.sonar.openedge:sonar-openedge-plugin:${cablVersion} -Dtransitive=false && cp $HOME/.m2/repository/eu/rssw/sonar/openedge/sonar-openedge-plugin/${cablVersion}/sonar-openedge-plugin-${cablVersion}.jar analyzers/sonaroe.jar"
            sh "$MVN_HOME/bin/mvn -U -B -ntp dependency:get -Dartifact=eu.rssw.sonar.openedge:progress-rules-plugin:${prgsRulesVersion} -Dtransitive=false && cp $HOME/.m2/repository/eu/rssw/sonar/openedge/progress-rules-plugin/${prgsRulesVersion}/progress-rules-plugin-${prgsRulesVersion}.jar analyzers/progress.jar"
            sh "$MVN_HOME/bin/mvn -U -B -ntp dependency:get -Dartifact=org.sonarsource.sonarlint.ls:sonarlint-language-server:${slintlsVersion} -Dtransitive=false && cp $HOME/.m2/repository/org/sonarsource/sonarlint/ls/sonarlint-language-server/${slintlsVersion}/sonarlint-language-server-${slintlsVersion}.jar server/sonarlint-ls.jar"
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
            // sh 'npm run cyclonedx-run -- --output-file sonarlint-vscode-4.5.1.sbom-cyclonedx.json'
            // Builds 3 VSIX packages: a JVM-less universal one, plus win32-x64 and linux-x64
            // packages each bundling their own JRE (downloaded on the fly). See build-sonarlint/package-all.mjs
            // and build-sonarlint/constants.mjs (TARGETED_PLATFORMS) to add/remove target platforms.
            sh 'npm run package-all'
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
