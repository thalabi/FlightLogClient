pipeline {
    agent any
    // tools { 
    //     maven 'Maven 3.5.2' 
    //     jdk 'jdk-13.0.1+9' 
    // }
    stages {
        stage ('Initialize') {
            steps {
                echo "Branch is ${BRANCH_NAME} ..."
                sh '''
                echo "PATH = ${PATH}"
                echo "M2_HOME = ${M2_HOME}"
                echo "BRANCH_NAME = ${BRANCH_NAME}"
                java -version
                '''
                // withNPM(npmrcConfig:'my-custom-npmrc') {
                //     echo "Performing npm build..."
                //     sh 'npm install'
                // }
            }
        }

        stage ('Build') {
            steps {
                sh '''
                cd src/environments
                ls -l
                cat *
                DATE=`date -u '+%Y-%m-%d %H:%M UTC'`
                echo $DATE
                sed -i "s/@buildTimestamp@/$DATE/" environment.prod.ts
                ls -l
                cat *
                pwd
                cd ../..
                pwd
                npm install && ng build --prod --base-href=/FlightLog/
                '''
            }
		}
		
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