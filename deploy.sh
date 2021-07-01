docker build -t nhannt1905/fib-client:latest -t nhannt1905/fib-client:$SHA -f ./client/Dockerfile ./client
docker build -t nhannt1905/fib-server:latest -t nhannt1905/fib-server:$SHA -f ./server/Dockerfile ./server
docker build -t nhannt1905/fib-worker:latest -t nhannt1905/fib-worker:$SHA -f ./worker/Dockerfile ./worker

docker push nhannt1905/fib-client:latest
docker push nhannt1905/fib-server:latest
docker push nhannt1905/fib-worker:latest
docker push nhannt1905/fib-client:$SHA
docker push nhannt1905/fib-server:$SHA
docker push nhannt1905/fib-worker:$SHA

kubectl apply -f k8s
kubectl set image deployment/client-deploy client=nhannt1905/fib-client:$SHA
kubectl set image deployment/server-deploy server=nhannt1905/fib-server:$SHA
kubectl set image deployment/worker-deploy worker=nhannt1905/fib-worker:$SHA