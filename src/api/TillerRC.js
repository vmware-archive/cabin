/*
  Copyright 2015 Skippbox, Ltd

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/
export default {
  apiVersion: 'v1',
  kind: 'ReplicationController',
  metadata: {
    labels: {
      app: 'helm',
      name: 'tiller',
    },
    name: 'tiller-rc',
    namespace: 'default',
  },
  spec: {
    replicas: 1,
    selector: {
      app: 'helm',
      name: 'tiller',
    },
    template: {
      metadata: {
        labels: {
          app: 'helm',
          name: 'tiller',
        },
      },
      spec: {
        containers: [
        { image: 'gcr.io/kubernetes-helm/tiller:canary',
          name: 'tiller',
          ports: [
          { containerPort: 44134,
            name: 'tiller',
          }],
          imagePullPolicy: 'Always',
          livenessProbe: {
            httpGet: {
              path: '/liveness',
              port: 44135,
            },
            initialDelaySeconds: 1,
            timeoutSeconds: 1,
          },
          readinessProbe: {
            httpGet: {
              path: '/readiness',
              port: 44135,
            },
            initialDelaySeconds: 1,
            timeoutSeconds: 1,
          },
        }],
      },
    },
  },
};
