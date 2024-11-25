rm -rf src/main/resources/static

cd ../pront
npm run build

mv dist ../Backend/src/main/resources/static

cd ../Backend

./gradlew bootJar

scp -i src/main/resources/secret/key1121.pem build/libs/Backend-0.0.1-SNAPSHOT.jar ubuntu@3.36.50.164:./prj.jar

ssh -i src/main/resources/secret/key1121.pem ubuntu@3.36.50.164 './run.sh'