commands in order

```
docker build -t template -f .\Dockerfile .        // use command in .sln directory level. The name (template) must be same as in k8s depl file for the project
```
```
kubectl create secret generic mssql --from-literal=SA_PASSWORD="Password1!"    //env variable name (SA_PASSWORD here) must be same as in sql depl k8s file
```
```
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.10.0/deploy/static/provider/cloud/deploy.yaml
```

move to k8s directory
```
kubectl apply -f .
```


kubectl get services  // to check running services
