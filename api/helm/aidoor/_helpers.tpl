{{/*
Expand the name of the chart.
*/}}
{{- define "aidoor.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
*/}}
{{- define "aidoor.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "aidoor.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "aidoor.labels" -}}
helm.sh/chart: {{ include "aidoor.chart" . }}
{{ include "aidoor.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "aidoor.selectorLabels" -}}
app.kubernetes.io/name: {{ include "aidoor.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/*
Redis connection string
*/}}
{{- define "aidoor.redisHost" -}}
{{- if .Values.redis.enabled -}}
{{- /* 当作为子chart使用时，service名称将由Helm自动确定 */ -}}
{{- $redisServiceName := printf "%s-%s" .Release.Name "custom-redis" -}}

{{- if .Values.redis.auth.enabled -}}
{{- if .Values.redis.auth.existingSecret -}}
{{- printf "%s:6379,password=${REDIS_PASSWORD}" $redisServiceName -}}
{{- else -}}
{{- printf "%s:6379,password=%s" $redisServiceName (.Values.redis.auth.password | default "") -}}
{{- end -}}
{{- else -}}
{{- printf "%s:6379" $redisServiceName -}}
{{- end -}}
{{- else -}}
{{- "localhost:6379" -}}
{{- end -}}
{{- end -}} 