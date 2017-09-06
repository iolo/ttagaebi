ttagaebi
========

따개비(barnacle)는: 

- 도커 컨테이너 안에서 실행되는 서비스를
- 서비스 디스커버리에 등록하기 위해 
- 외부에 노출된 ip와 port를 알려주는
- 초간단 http 서버(주로 도커 엔진 API 프록시)입니다.

## 따개비를 도커 컨테이너로 실행하기

```
$ docker run --name=ttagaebi -P -v /var/run/docker.sock:/var/run/docker.sock --add-host dockerhost:`ip route show 0/0 | cut -d' ' -f3` --rm iolo/ttagaebi
```

> **NOTE**
>
> `ip route show 0/0 | cut -d' ' -f3`는 도커 호스트의 ip 주소를 얻기 위한 명령입니다.
> 맥용 도커라면 `ipconfig getifaddr en0`으로 대체할 수 있습니다.
> 나름의 방식으로 도커 호스트의 ip를 알아내서 지정하면 됩니다.

## 컨테이너 내부에서 외부로 노출된 ip/port 얻기

```
$ curl http://ttagaebi:8765/whoami
{"dockerhost":"172.16.212.194","ip":"172.17.0.3","ports":{"8080":32777}}
```

---
may the **SOURCE** be with you...
