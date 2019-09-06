const StorageChaincode = require('chaincode-node-storage');
const ExpectationMaximization = require('ml-expectation-maximization').ExpectationMaximization;
const shim = require('fabric-shim');
const tools = require('chaincode-node-storage/chaincode-tools');
module.exports = class ReferenceChaincode extends StorageChaincode {
    /**
     * ===========================================================================
     * Code bellow belong to cctaskpts/taskpts {chaincode/channel}
     * ===========================================================================
     */

    /**
     * data to fit for expectation maximisation are 2d array x=>user, y=>feature.
     * feature present the count of each activity
     * @param args
     */
    async quality(args) {
        console.log(this.createTaskpts('asd', 'asd', 10, 10));
        if (args.length < 1) {
            throw new Error('incorrect number of arguments, taskId at pos 0 is required');
        }
        let tid = args[0];
        let exists = await this.getTaskpts([tid]).then(value => JSON.parse(value));
        let data = await super.invokeChaincode('ccobservations', ['aggregate', tid], 'observations').then(value => JSON.parse(value));
        if (!data || tools.sizeOf(data) == 0) {
            throw new Error('no observations, please ensure you input the correct task id');
        } else {
            let training = [];
            for (let uid in data) {
                training.push(data[uid]);
            }
            const em = new ExpectationMaximization({numClusters: 1});
            em.train(training);
            // TODO: need a method to calculate the scores
            let scores = em.predict(training);
            let results = [];
            for (let uid in data) {
                let taskpts = this.createTaskpts(tid, uid, 10, 10);
                results.push(taskpts);
            }
            return Buffer.from(JSON.stringify(results));
        }
    }

    /**
     * [1] return all the taskpts of task 1
     * [1,1] return all the taskpts of user 1 in task 1
     * [false,1] return all the taskpts of user 1 in all tasks
     *
     * @param args
     * @returns {Promise<Buffer>}
     */
    async getTaskpts(args) {
        let tid = args[0] || false;
        let uid = args[1] || false;
        return super.list(['taskpts'])
            .then(value => JSON.parse(value))
            .then(value => value.filter(item => {
                let accept = true;
                if (tid !== false) {
                    accept = item.value.tid == tid;
                }
                if (accept && uid !== false) {
                    accept = item.value.uid == uid;
                }
                return accept;
            })).then(value => Buffer.from(JSON.stringify(value)))
    }

    createTaskpts($taskId, $userId, $quality, $payment) {
        return JSON.stringify({
            'tid': $taskId,
            'uid': $userId,
            'quality': $quality,
            'payment': $payment,
            'isDeleted': 0
        });
    }


    /**
     * ===========================================================================
     * Code bellow belong to ccobservations/observations {chaincode/channel}
     * ===========================================================================
     */
    /**
     * [1] return all the observations of task 1
     * [1,1] return all the observations of user 1 in task 1
     * [false,1] return all the observations of user 1 in all tasks
     * @param args
     * @returns {Promise<Buffer>}
     */
    async observations(args) {
        let tid = args[0] || false;
        let uid = args[1] || false;
        return super.list(['observation'])
            .then(value => JSON.parse(value))
            .then(value => value.filter(obs => {
                let accept = obs.isDeleted || true;
                if (tid !== false) {
                    accept = obs.value.tid == tid;
                }
                if (accept && uid !== false) {
                    accept = obs.value.uid == uid;
                }
                return accept;
            }))
            .then(value => Buffer.from(JSON.stringify(value)));
    }

    async aggregate(args) {
        let tid = args[0] || false;
        let uid = args[1] || false;
        let observations = await super.invokeChaincode('ccobservations', ['observations', tid, uid], 'observations').then(value => JSON.parse(value));
        if (!observations) {
            return Buffer.from(JSON.stringify([]));
        } else {
            let data = {};
            for (let pos in observations) {
                let observation = observations[pos].value;
                let uid = observation.uid.toString();
                let record = JSON.parse(observation.record);
                if (!data[uid]) data[uid] = [];
                data[uid].push(parseInt(record.activity));
            }
            let agg = {};
            for (let uid in data) {
                let activities = data[uid];
                let set = [];
                [1, 2, 3, 4, 5, 6, 7].forEach(value => {
                    set[value] = activities.filter(act => {
                        return act == value
                    }).length;
                });
                set = set.filter(value => value != null || value != undefined);
                agg[uid] = set;
            }
            return Buffer.from(JSON.stringify(agg));
        }
    }

    /**
     * ===========================================================================
     * Code bellow belong to ccreports/reports {chaincode/channel}
     * ===========================================================================
     */

    /**
     * [1] generate (optional) and return the report of task 1
     * @param args
     * @returns {Promise<Buffer>}
     */
    async report(args) {
        if (args.length < 1) {
            throw new Error('incorrect number of arguments, taskId at pos 0 is required');
        }
        let report = await super.list(['reports']).then(value => JSON.parse(value));
        if (!report || report.length == 0) {
            let tid = args[0];
            let data = await super.invokeChaincode('ccobservations', ['aggregate', tid], 'observations').then(value => JSON.parse(value));
            report = {tid: tid, data: {1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0}};
            for (let uid in data) {
                for (let activity in data[uid]) {
                    report.data[parseInt(activity) + 1] += data[uid][activity];
                }
            }
            let jsonReport = JSON.stringify(report);
            super.put(['reports', jsonReport]);
            return Buffer.from(jsonReport);
        } else {
            return Buffer.from(JSON.stringify(report));
        }
    }

    /**
     * check if the report is generated or not
     * @param args
     * @returns {Promise<Buffer>}
     */
    async exists(args) {
        if (args.length < 1) {
            throw new Error('incorrect number of arguments, taskId at pos 0 is required');
        }
        let tid = args[0];
        let response = await super.list(['reports']).then(value => JSON.parse(value));
        if (!response || response.length == 0) {
            return Buffer.from(JSON.stringify(false));
        } else {
            return Buffer.from(JSON.stringify(true));
        }
    }


    async addUser(args) {
        return super.put(['user', args[0], args[1]]);
    }
};
