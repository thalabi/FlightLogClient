pipeline {
    agent any
     tools { 
    //     maven 'Maven 3.5.2' 
         jdk 'jdk-17' 
    }
    stages {
        stage ('Initialize') {
            steps {
                echo "Branch is ${BRANCH_NAME} ..."
                sh '''
                echo "PATH = ${PATH}"
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
                #sed -i "s/@buildTimestamp@/$DATE/" environment.prod.ts
                sed -i "s/@buildTimestamp@/${BRANCH_NAME}_${DATE}/" environment.prod.ts
                ls -l
                cat *
                pwd
                cd ../..
                pwd
                #npm install && ng build --prod --base-href=/FlightLog/
                npm install && ng build --prod
                #jar -cvf FlightLogClient.jar dist
                '''
            }
		}
		
        stage ('Package') {
			when {
			    not {
			        branch 'master'
			    }
			}
            steps {
                sh '''
                jar -cvf FlightLogClient-${BRANCH_NAME}.jar dist
                '''
            }
		}

        stage ('Deploy') {
			when {
			    not {
			        branch 'master'
			    }
			}
			steps {
                sh '''
                REPOSITORY="maven-releases"
                if [[ $BRANCH_NAME == *"SNAPSHOT"* ]]; then
                    REPOSITORY="maven-snapshots"
                fi
                echo "REPOSITORY = ${REPOSITORY}"

                mvn deploy:deploy-file -DgroupId=com.kerneldc -DartifactId=FlightLogClient -Dversion=${BRANCH_NAME} -DgeneratePom=true -Dpackaging=jar -DrepositoryId=kerneldc-nexus -Durl=http://localhost:8081/repository/${REPOSITORY} -Dfile=FlightLogClient-${BRANCH_NAME}.jar
                '''
            }
        }
    }
}