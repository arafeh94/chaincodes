const tools = require('chaincode-node-storage/chaincode-tools');
const shim = require('fabric-shim');
const Chaincode = require('./chaincode-reference');
const mock = require("@theledger/fabric-mock-stub");


async function main() {
    await new Promise(async function () {
        const ccuser = new mock.ChaincodeMockStub("ccuser", new Chaincode());
        const cctask = new mock.ChaincodeMockStub("cctask", new Chaincode());
        const ccobservations = new mock.ChaincodeMockStub("ccobservations", new Chaincode());
        const cctaskpts = new mock.ChaincodeMockStub("cctaskpts", new Chaincode());
        const ccreputation = new mock.ChaincodeMockStub("cctaskp", new Chaincode());
        const ccreport = new mock.ChaincodeMockStub("ccreport", new Chaincode());
        ccuser.mockPeerChaincode('src/users', ccuser);
        ccuser.mockPeerChaincode('cctasks/tasks', cctask);
        ccuser.mockPeerChaincode('ccobservations/observations', ccobservations);
        ccuser.mockPeerChaincode('cctaskpts/taskpts', cctaskpts);
        ccuser.mockPeerChaincode('ccreputations/reputations', ccreputation);
        ccuser.mockPeerChaincode('ccreports/reports', ccreport);

        cctask.mockPeerChaincode('src/users', ccuser);
        cctask.mockPeerChaincode('cctasks/tasks', cctask);
        cctask.mockPeerChaincode('ccobservations/observations', ccobservations);
        cctask.mockPeerChaincode('cctaskpts/taskpts', cctaskpts);
        cctask.mockPeerChaincode('ccreputations/reputations', ccreputation);
        cctask.mockPeerChaincode('ccreports/reports', ccreport);

        ccobservations.mockPeerChaincode('src/users', ccuser);
        ccobservations.mockPeerChaincode('cctasks/tasks', cctask);
        ccobservations.mockPeerChaincode('ccobservations/observations', ccobservations);
        ccobservations.mockPeerChaincode('cctaskpts/taskpts', cctaskpts);
        ccobservations.mockPeerChaincode('ccreputations/reputations', ccreputation);
        ccobservations.mockPeerChaincode('ccreports/reports', ccreport);

        cctaskpts.mockPeerChaincode('src/users', ccuser);
        cctaskpts.mockPeerChaincode('cctasks/tasks', cctask);
        cctaskpts.mockPeerChaincode('ccobservations/observations', ccobservations);
        cctaskpts.mockPeerChaincode('cctaskpts/taskpts', cctaskpts);
        cctaskpts.mockPeerChaincode('ccreputations/reputations', ccreputation);
        cctaskpts.mockPeerChaincode('ccreports/reports', ccreport);

        ccreputation.mockPeerChaincode('src/users', ccuser);
        ccreputation.mockPeerChaincode('cctasks/tasks', cctask);
        ccreputation.mockPeerChaincode('ccobservations/observations', ccobservations);
        ccreputation.mockPeerChaincode('cctaskpts/taskpts', cctaskpts);
        ccreputation.mockPeerChaincode('ccreputations/reputations', ccreputation);
        ccreputation.mockPeerChaincode('ccreports/reports', ccreport);

        ccreport.mockPeerChaincode('src/users', ccuser);
        ccreport.mockPeerChaincode('cctasks/tasks', cctask);
        ccreport.mockPeerChaincode('ccobservations/observations', ccobservations);
        ccreport.mockPeerChaincode('cctaskpts/taskpts', cctaskpts);
        ccreport.mockPeerChaincode('ccreputations/reputations', ccreputation);
        ccreport.mockPeerChaincode('ccreports/reports', ccreport);

        await ccuser.mockInit("tx1", []);
        await cctask.mockInit("tx1", []);
        await ccobservations.mockInit("tx1", []);
        await cctaskpts.mockInit("tx1", []);
        await ccreputation.mockInit("tx1", []);
        await ccreport.mockInit("tx1", []);

        await test2(ccuser, cctask, ccobservations, cctaskpts, ccreputation, ccreport);

    });


    /**
     * @param {ChaincodeMockStub} ccuser
     * @param {ChaincodeMockStub} cctask
     * @param {ChaincodeMockStub} ccobservations
     * @param {ChaincodeMockStub} cctaskpts
     * @param {ChaincodeMockStub} ccreputation
     * @param {ChaincodeMockStub} ccreport
     */
    async function test0(ccuser, cctask, ccobservations, cctaskpts, ccreputation, ccreport) {
        console.log('test0');
        const {spawn} = require('child_process');
        const fs = require('fs');
        const filePath = "/tmp/" + tools.uuid();
        let data = [
            [1, 1, 1, 1],
            [1, 1, 1, 1],
            [1, 1, 1, 1],
            [1, 1, 1, 1],
            [1, 1, 1, 1],
            [5, 2, 1, 8],
            [110, 55, 12, 21]
        ];
        fs.writeFile(filePath, JSON.stringify(data), function (err) {
            if (err) return console.log(err);
            let ls = spawn('python', ['/scripts/quality.py', filePath]);
            ls.stdout.on('data', data => {
                console.log(data.toString());
            });
        });
    }

    /**
     * @param {ChaincodeMockStub} ccuser
     * @param {ChaincodeMockStub} cctask
     * @param {ChaincodeMockStub} ccobservations
     * @param {ChaincodeMockStub} cctaskpts
     * @param {ChaincodeMockStub} ccreputation
     * @param {ChaincodeMockStub} ccreport
     */
    async function test1(ccuser, cctask, ccobservations, cctaskpts, ccreputation, ccreport) {
        let res = false;

        res = await cctask.mockInvoke("tx2", ['put', 'task', '1', user('arafeh', 'arafeh198', '123456', 'c')]);
        res = await cctask.mockInvoke("tx2", ['list', 'task']);
        sts(res);
        res = await cctask.mockInvoke("tx2", ['t']);
        console.log(res);
        sts(res)
    }

    /**
     * @param {ChaincodeMockStub} ccuser
     * @param {ChaincodeMockStub} cctask
     * @param {ChaincodeMockStub} ccobservations
     * @param {ChaincodeMockStub} cctaskpts
     * @param {ChaincodeMockStub} ccreputation
     * @param {ChaincodeMockStub} ccreport
     */
    async function test2(ccuser, cctask, ccobservations, cctaskpts, ccreputation, ccreport) {
        let res = false;

        res = await ccuser.mockInvoke("tx2", ['put', 'task', '1', user('arafeh', 'arafeh198', '123456', 'c')]);

        res = await ccuser.mockInvoke("tx2", ['put', 'user', '1', user('arafeh', 'arafeh198', '123456', 'c')]);
        res = await ccuser.mockInvoke("tx2", ['put', 'user', '2', user('hammoud', 'hammoud123', '123456', 'p')]);
        res = await cctask.mockInvoke("tx2", ['put', 'task', '1', task(1, 'collect', 10, 100)]);
        res = await ccobservations.mockInvoke("tx2", ['put', 'observation', atomic(), observation(1, 1, {activity: '4'})]);
        res = await ccobservations.mockInvoke("tx2", ['put', 'observation', atomic(), observation(1, 1, {activity: '4'})]);
        res = await ccobservations.mockInvoke("tx2", ['put', 'observation', atomic(), observation(1, 1, {activity: '4'})]);
        res = await ccobservations.mockInvoke("tx2", ['put', 'observation', atomic(), observation(1, 1, {activity: '4'})]);

        res = await ccobservations.mockInvoke("tx2", ['put', 'observation', atomic(), observation(2, 1, {activity: '1'})]);
        res = await ccobservations.mockInvoke("tx2", ['put', 'observation', atomic(), observation(2, 1, {activity: '1'})]);
        res = await ccobservations.mockInvoke("tx2", ['put', 'observation', atomic(), observation(2, 1, {activity: '1'})]);
        res = await ccobservations.mockInvoke("tx2", ['put', 'observation', atomic(), observation(2, 1, {activity: '1'})]);

        res = await ccobservations.mockInvoke("tx2", ['put', 'observation', atomic(), observation(3, 1, {activity: '4'})]);
        res = await ccobservations.mockInvoke("tx2", ['put', 'observation', atomic(), observation(3, 1, {activity: '4'})]);
        res = await ccobservations.mockInvoke("tx2", ['put', 'observation', atomic(), observation(3, 1, {activity: '2'})]);
        res = await ccobservations.mockInvoke("tx2", ['put', 'observation', atomic(), observation(3, 1, {activity: '2'})]);

        res = await ccobservations.mockInvoke("tx2", ['put', 'observation', atomic(), observation(4, 1, {activity: '4'})]);
        res = await ccobservations.mockInvoke("tx2", ['put', 'observation', atomic(), observation(4, 1, {activity: '4'})]);
        res = await ccobservations.mockInvoke("tx2", ['put', 'observation', atomic(), observation(4, 1, {activity: '3'})]);
        res = await ccobservations.mockInvoke("tx2", ['put', 'observation', atomic(), observation(4, 1, {activity: '1'})]);

        res = await cctaskpts.mockInvoke("tx3", ['quality', '1']);
        sts(res);
        // res = await cctaskpts.mockInvoke("tx3", ['report', '1']);
        // sts(res);

    }

}

function sts(res) {
    console.log(res.status);
    console.log(res.payload.toString());
}

function dis(res) {
    let ar = parse(res.payload);
    for (let pos in ar) {
        let item = ar[pos];
        console.log(item.key, ':', json(item.value))
    }
}

function json(obj) {
    return JSON.stringify(obj)
}

function parse(obj) {
    return JSON.parse(obj)
}

function user(name, email, password, type) {
    return json({
        'username': name,
        'email': email,
        'password': password,
        'type': type,
        'isDeleted': 0
    });
}

function task($userId, $title, $minQuality, $budget) {
    return json({
        'minQ': $minQuality,
        'budget': $budget,
        'expDt': '',
        'uid': $userId,
        'title': $title,
        'status': 'PENDING',
    });
}

function observation($userId, $taskId, $record) {
    return json({
        'uid': $userId,
        'tid': $taskId,
        'date': new Date(),
        'record': JSON.stringify($record),
        'isDeleted': 0
    });
}

function taskQ($taskId, $userId) {
    return json({
        'tid': $taskId,
        'uid': $userId,
        'quality': 0,
        'payment': 0,
        'isDeleted': 0
    });
}

function panic(error) {
    console.error(error);
    process.exit(1);
}

i = 0;

function atomic() {
    return (i++).toString();
}

// https://stackoverflow.com/a/46916601/1478566
main().catch(panic).then(clearInterval.bind(null, setInterval(a => a, 1E9)));