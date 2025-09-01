commands in order


 use command in .sln directory level. The name (template) must be same as in k8s depl file for the project
```
docker build -t template -f .\Template\Dockerfile .        
```

env variable name (SA_PASSWORD here) must be same as in sql depl k8s file
```
kubectl create secret generic mssql --from-literal=SA_PASSWORD="Password1!"    
```

```
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.10.0/deploy/static/provider/cloud/deploy.yaml
```

move to k8s directory
```
kubectl apply -f .
```

 to check running services
```
kubectl get services 
```

In case of problems with NGINX gateway

re-run
```
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.10.0/deploy/static/provider/cloud/deploy.yaml
```

Check if there's ingress-nginx-admission
```
kubectl get secret -n ingress-nginx ingress-nginx-admission
```

If it exists, kubernetes should get ingress running soon
