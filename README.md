MAKE SURE DOCKER DESKTOP IS RUNNING (for kubernetes commands) AND KUBERNETES IS ENABLED

commands in order


 use command in .sln directory level. The name (template) must be same as in k8s depl file for the project
```
docker build -t template -f .\Template\Dockerfile .        
```

env variable name (SA_PASSWORD here) must be same as in sql depl k8s file
```
kubectl create secret generic mssql --from-literal=SA_PASSWORD="Password1!"    
```
secrets for postgre sql
```
kubectl create secret generic postgres-secret \
  --from-literal=POSTGRES_USER=myuser \
  --from-literal=POSTGRES_PASSWORD=mypassword \
  --from-literal=POSTGRES_DB=mydb
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



Made changes in code of the application?
Build application and then rebuild docker image. After that use
```
kubectl rollout restart deployment/name-of-deployment
```
Where name of deployment is the one that had it's image updated so Kubernetes uses newest version.

Made changes in .yaml file in K8S directory?
```
kubectl apply -f name-of-file
```
where name of file is the one that had changes. 

But you can also just run 
```
kubectl apply -f .
```
and it will automatically apply those files where it detects changes


You want to restart deployment that is not in default namespace?
```
kubectl rollout restart deployment/name-of-deployment -n name-of-namespace
```

Check existing namespaces 
```
kubectl get namespaces
```
Check existing deployments
```
kubectl get deployments
```
Check existing services
```
kubectl get services
```

Deployment/service is in different namespace?
```
kubectl get deployments --namespace=name-of-namespace
```
Same for services
```
kubectl get services --namespace=name-of-namespace
```
