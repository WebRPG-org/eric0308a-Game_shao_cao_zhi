# Game_shao_cao_zhi

## 程式碼測試

```bash
npm install -g http-server
http-server
```

## 部署

### 測試

```bash
docker build -t shao-cao-zhi-game:v1.0 .
docker run -d -p 8080:80 --name shao-cao-zhi shao-cao-zhi-game:v1.0
```

### 推送

```bash
docker login
docker tag shao-cao-zhi-game:v1.0 eric0308a/shao-cao-zhi-game:v1.0
docker push eric0308a/shao-cao-zhi-game:v1.0
```

### 拉取

```bash
docker run -d -p 5548:80 eric0308a/shao-cao-zhi-game:v1.0
```