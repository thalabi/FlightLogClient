pipeline {
    agent any
    // tools { 
    //     maven 'Maven 3.5.2' 
    //     jdk 'jdk-13.0.1+9' 
    // }
    stages {
        stage ('Initialize') {
            steps {
                sh '''
                echo "PATH = ${PATH}"
                echo "M2_HOME = ${M2_HOME}"
                echo "BRANCH_NAME = ${BRANCH_NAME}"
                java -version
                '''
            }
        }

        // stage ('Build') {
        //     steps {
        //         sh '''
        //         cd FlightLogServer
        //         mvn clean package
        //         '''
        //     }
		// }
		
        // stage ('Deploy') {
		// 	when {
		// 	    not {
		// 	        branch 'master'
		// 	    }
		// 	}
		// 	steps {
        //         sh '''
        //         cd FlightLogServer
        //         mvn deploy -Dmaven.test.skip=true
        //         '''
        //     }
        // }
    }
}