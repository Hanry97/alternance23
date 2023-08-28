var yAxis,xAxis,chart,legend,root, cSeries=[];
function createChart(){
     root = am5.Root.new("chartdiv2");


// Create chart
// https://www.amcharts.com/docs/v5/charts/xy-chart/
    chart = root.container.children.push(am5xy.XYChart.new(root, {
        panX: false,
        panY: false,
        wheelX: "panX",
        wheelY: "zoomX",
        layout: root.verticalLayout
    }));



// Data



// Create axes
// https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
    yAxis = chart.yAxes.push(am5xy.CategoryAxis.new(root, {
        categoryField: "Centre",
        renderer: am5xy.AxisRendererY.new(root, {
            inversed: true,
            cellStartLocation: 0.1,
            cellEndLocation: 0.9
        })
    }));


     xAxis = chart.xAxes.push(am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererX.new(root, {
            strokeOpacity: 0.1
        }),
        min: 0
    }));



// Add legend
// https://www.amcharts.com/docs/v5/charts/xy-chart/legend-xy-series/
    legend = chart.children.push(am5.Legend.new(root, {
        centerX: am5.p50,
        x: am5.p50
    }));

// Add cursor
// https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
    var cursor = chart.set("cursor", am5xy.XYCursor.new(root, {
        behavior: "zoomY"
    }));
    cursor.lineY.set("forceHidden", true);
    cursor.lineX.set("forceHidden", true);


// Add series
// https://www.amcharts.com/docs/v5/charts/xy-chart/series/



    legend.data.setAll(chart.series.values);


// Make stuff animate on load
// https://www.amcharts.com/docs/v5/concepts/animations/
    chart.appear(1000, 100);
}

function createSeries(field, name,data) {
    var series = chart.series.push(am5xy.ColumnSeries.new(root, {
        name: name,
        xAxis: xAxis,
        yAxis: yAxis,
        valueXField: field,
        categoryYField: "Centre",
        sequencedInterpolation: true,
        tooltip: am5.Tooltip.new(root, {
            pointerOrientation: "horizontal",
            labelText: "[bold]{name}[/]\n{categoryY}: {valueX}"
        })
    }));

    series.columns.template.setAll({
        height: am5.p100,
        strokeOpacity: 0
    });


    series.bullets.push(function() {
        return am5.Bullet.new(root, {
            locationX: 1,
            locationY: 0.5,
            sprite: am5.Label.new(root, {
                centerY: am5.p50,
                text: "{valueX}",
                populateText: true
            })
        });
    });

    series.bullets.push(function() {
        return am5.Bullet.new(root, {
            locationX: 1,
            locationY: 0.5,
            sprite: am5.Label.new(root, {
                centerX: am5.p100,
                centerY: am5.p50,
                text: "{name}",
                fill: am5.color(0xffffff),
                populateText: true
            })
        });
    });
    series.data.setAll(data);
    series.appear();

    return series;
}
function loadChart(candidats=[],data) {
    yAxis.data.setAll([]);
    cSeries.forEach(series=>{
        series.dispose();
    })
    console.dir(data)
    var dataFormated=[]

    if(data.scores){
        var score = data.scores
        var item = {}
        item.Centre = data.country
        candidats.forEach(candidat=>{
            var sc=score.filter(sc=>sc.candidat===candidat.code)[0]
            if(sc) {
                sc = sc.score
                if(isNaN(sc) && sc.includes("%")){
                    sc=sc.replace("%","")
                    sc=sc.replace(",",".")
                    sc = parseFloat(sc)
                }
                item[candidat.code] = sc
            }
        })
        dataFormated.push(item)
    }else {
        var cities = data.cities
        if(cities){
            cities.forEach(city=>{
                var item = {}
                if(city.scores){
                    item.Centre = city.name
                    var score = city.scores
                    candidats.forEach(candidat=>{
                        var sc=score.filter(sc=>sc.candidat===candidat.code)[0]
                        if(sc) {
                            sc = sc.score
                            if(isNaN(sc) && sc.includes("%")){
                                sc=sc.replace("%","")
                                sc=sc.replace(",",".")
                                sc = parseFloat(sc)
                            }
                            item[candidat.code] = sc
                        }
                    })
                    dataFormated.push(item)
                }
                else if(city.bureaux){
                    var bureaux = city.bureaux
                    bureaux.forEach(bureau=>{
                        var item = {}
                         item.Centre = ""+city.name+" - "+ bureau.name
                        var score = bureau.scores
                        if(score) {
                            candidats.forEach(candidat => {
                                var sc = score.filter(sc => sc.candidat === candidat.code)[0]
                                if (sc) {
                                    sc = sc.score
                                    if (isNaN(sc) && sc.includes("%")) {
                                        sc = sc.replace("%", "")
                                        sc = sc.replace(",", ".")
                                        sc = parseFloat(sc)
                                    }
                                    item[candidat.code] = sc
                                }
                            })
                            dataFormated.push(item)
                        }
                    })
                }
            })
        }


    }
    console.dir(dataFormated)
    yAxis.data.setAll(dataFormated);
    candidats.forEach(candidat=>{
        cSeries.push(createSeries( candidat.code,candidat.code, dataFormated));
    })
}
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}