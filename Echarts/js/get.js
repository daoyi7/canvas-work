function ctesiEcharts() {
    let log = console.log.bind(console)
    let secondPt = [];
    let dataY = [];
    let dataAll = [];
    let parB = [];
    let parBMoney = [];
    let dataBar = [];
    let dataPie = [];
    let rgb = [];
    let unrgb = [];
    let r, g, b;

    //前端读出记录数
    let all = window.parent.BC_ContractInfoTBase.getRecordCount();

    for (let i = 0; i < all; i++) {
        var PartyB = window.parent.BC_ContractInfoTBase.getRowFieldValue(i, 'PartyB');

        secondPt.push(PartyB);
        // 数组去重
        Array.prototype.unique = function () {
            this.sort();
            var res = [this[0]];
            for (var i = 1; i < this.length; i++) {
                if (this[i] !== res[res.length - 1]) {
                    res.push(this[i]);
                }
            }
            return res;
        };
        var xCoord = secondPt.unique()
        // var xCoord = Array.from(new Set(secondPt))
    }

    // 计算类型数组并且为每个求和
    for (var i = 0; i < xCoord.length; i++) {
        dataY[i] = [];
        parB[i] = [];
        for (var k = 0; k < secondPt.length; k++) {
            if (secondPt[k] === xCoord[i]) {
                var j = k;

                var dt = window.parent.BC_ContractInfoTBase.getRowFieldValue(j, 'ContractAmount');

                dataY[i].push(Math.floor(dt * 100) / 100)
                parB[i].push(xCoord[i])
                // log(xCoord[i]+":"+dt)
                // parBMoney[i].push(dt)
            }
        }
        const yAll = dataY[i].reduce(function (sum, value) {
            return sum + value
        })
        dataAll.push(yAll)
    }

    for(var i=0;i<dataY.length;i++) {
        parBMoney[i] = [];

        parBMoney[i].push(dataY[i])
    }

    log(parBMoney)

    // 计算类型数组的次数
    for (let i = 0; i < parB.length; i++) {
        rgb[i] = [];
        dataBar.push({
            value: parB[i].length,
            name: parB[i][0]
        })
        dataPie.push(parB[i][0])

        r = parseInt(Math.random() * 255)
        g = parseInt(Math.random() * 255)
        b = parseInt(Math.random() * 255)
        rgb[i].push('rgb(' + r + ',' + g + ',' + b + ')')
    }

    for (let i = 0; i < rgb.length; i++) {
        unrgb[i] = []
        unrgb[i] = rgb[rgb.length - 1 - i]
    }

    let ContractAmount = document.querySelector("#ContractAmount");
    let WithPartyB = document.querySelector("#WithPartyB");

    // 定义宽高
    function selfWandH(obj) {
        obj.style.width = '100%';
        obj.style.height = '100%';
    }

    selfWandH(ContractAmount)
    selfWandH(WithPartyB)

    let ecContractAmount = echarts.init(ContractAmount);
    let ecWithPartyB = echarts.init(WithPartyB);
    // 窗口事件
    window.onresize = function () {
        selfWandH(ContractAmount)
        selfWandH(WithPartyB)

        ecContractAmount.resize();
        ecWithPartyB.resize();
    }
    let app = {};

    const optionContractAmount = {
        title: {
            text: '乙方总金额',
            left: 'center',
            top: 20,
        },
        tooltip: {
            trigger: 'axis',
            formatter: '{a} <br/>{b} : {c}',
            axisPointer: {
                type: 'none',
            },
        },
        xAxis: {
            type: 'category',
            name: '合同乙方',
//                boundaryGap: false,
            splitLine: {show: false},
            data: xCoord,
        },
        yAxis: {
            type: 'value',
            name: '总金额',
        },
        series: [
            {
                name: '总金额',
                type: 'bar',
                stack: '金额',
                data: parBMoney,
                itemStyle: {
                    normal: {
                        color: function (params) {
                            //首先定义一个数组
                            var colorList = unrgb;
                            return colorList[params.dataIndex]
                        },
                        label: {
                            show: false
                        }
                    },
                },
            },
        ]
    };
    const optionWithPartyB = {
        title: {
            text: '单位合同签订次数',
            left: 'center',
            top: 20,
        },
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
            orient: 'vertical',
            x: 'left',
            top: '20',
            data: dataPie
        },
        color: rgb,
        series: [
            {
                name: '签订次数',
                type: 'pie',
                radius: '55%',
                center: ['50%', '50%'],
                data: dataBar.sort(function (a, b) {
                    return a.value - b.value;
                }),
                roseType: 'radius',
                label: {
                    normal: {
                        show: true,
                        textStyle: {
                            color: '#000'
                        }
                    }
                },
                labelLine: {
                    normal: {
                        lineStyle: {
                            color: '#000'
                        },
                        smooth: 0.2,
                        length: 10,
                        length2: 20
                    }
                },
                //
                // animationType: 'scale',
                // animationEasing: 'elasticOut',
                // animationDelay: function (idx) {
                //     return Math.random() * 200;
                // }
            }
        ],
    };
    ecWithPartyB.setOption(optionWithPartyB);

    ecContractAmount.setOption(optionContractAmount);
}

ctesiEcharts();