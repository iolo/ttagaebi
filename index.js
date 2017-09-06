const DOCKER_SOCKET_PATH = process.env.DOCKER_SOCKET_PATH || '/var/run/docker.sock';
const PORT = process.env.PORT || 8765;
const HOST = process.env.HOST || '0.0.0.0';
const DOCKER_HOST_NAME = 'dockerhost'

const Docker = require('dockerode');
const dns = require('dns');
const express = require('express');

const docker = new Docker({socketPath: DOCKER_SOCKET_PATH});
const app = express();

app.get('/info', (req, res) => {
    docker.info((err, data) => {
        res.json(data);
    });
});
app.get('/version', (req, res) => {
    docker.version((err, data) => {
        res.json(data);
    });
});
app.get('/ping', (req, res) => {
    docker.ping((err, data) => {
        res.json(data);
    });
});
app.get('/containers', (req, res) => {
    docker.listContainers(req.query, (err, data) => {
        res.json(data);
    });
});
app.delete('/containers', (req, res) => {
    docker.pruneServices(req.query, (err, data) => {
        res.json(data);
    });
});
app.get('/containers/:id', (req, res) => {
    docker.getContainer(req.params.id).inspect((err, data) => {
        res.json(data);
    });
});
app.get('/images', (req, res) => {
    docker.listImages(req.query, (err, data) => {
        res.json(data);
    });
});
app.delete('/images', (req, res) => {
    docker.pruneImages(req.query, (err, data) => {
        res.json(data);
    });
});
app.get('/images/:id', (req, res) => {
    docker.getImage(req.params.id).inspect((err, data) => {
        res.json(data);
    });
});
app.get('/nodes', (req, res) => {
    docker.listNodes(req.query, (err, data) => {
        res.json(data);
    });
});
app.get('/nodes/:id', (req, res) => {
    docker.getNode(req.params.id).inspect((err, data) => {
        res.json(data);
    });
});
app.get('/tasks', (req, res) => {
    docker.listNodes(req.query, (err, data) => {
        res.json(data)
    });
});
// TODO: more proxy apis...
app.get('/whoami', (req, res) => {
    const ip = req.query.ip || req.ip;
    docker.listContainers({}, (err, data) => {
        const container = data
            .find((container) => {
                return Object.values(container.NetworkSettings.Networks)
                    .some((network) => {
                        return network.IPAddress === ip;
                    });
            });
        dns.lookup(DOCKER_HOST_NAME, (err, addr) => {
            res.status(container ? 200 : 404);
            res.json({
                dockerhost: addr,
                ip: container && ip,
                ports: container && container.Ports.reduce((result, port) => {
                    result[port.PrivatePort] = port.PublicPort;
                    return result;
                }, {})
            });
        });
    });
});
app.listen(PORT, HOST, () => {
    console.log(`running on http://${HOST}:${PORT}`);
});
