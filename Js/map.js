
am5.ready(async function () {


    const data = await readdata()
    const countries = await (await fetch("./Js/geodata/json/data/countries2.json")).json()
    const candidats = data.candidats
    const votes = data.votes
    const countriesData =votes.countries
    function traitementCountry(id){
        countryMap=countries[id]
        console.dir(countryMap.country)
        if(countryMap) {
            countryData = countriesData.filter(ct=>ct.country===countryMap.country)[0]
            console.dir(countriesData)
            if(countryData!=null){
                loadChart(candidats,countryData)
            }
        }
    }
// Create root element
// https://www.amcharts.com/docs/v5/getting-started/#Root_element
    var root = am5.Root.new("chartdiv");

// Set themes
// https://www.amcharts.com/docs/v5/concepts/themes/
    root.setThemes([am5themes_Animated.new(root)]);

// Create the map chart
// https://www.amcharts.com/docs/v5/charts/map-chart/
    var chart = root.container.children.push(
        am5map.MapChart.new(root, {
            panX: "rotateX",
            panY: "translateY",
            projection: am5map.geoMercator()
        })
    );

    var cont = chart.children.push(
        am5.Container.new(root, {
            layout: root.horizontalLayout,
            x: 20,
            y: 40
        })
    );

// Add labels and controls
    cont.children.push(
        am5.Label.new(root, {
            centerY: am5.p50,
            text: "Map"
        })
    );

    var switchButton = cont.children.push(
        am5.Button.new(root, {
            themeTags: ["switch"],
            centerY: am5.p50,
            icon: am5.Circle.new(root, {
                themeTags: ["icon"]
            })
        })
    );

    switchButton.on("active", function () {
        if (!switchButton.get("active")) {
            chart.set("projection", am5map.geoMercator());
            chart.set("panY", "translateY");
            chart.set("rotationY", 0);
            backgroundSeries.mapPolygons.template.set("fillOpacity", 0);
        } else {
            chart.set("projection", am5map.geoOrthographic());
            chart.set("panY", "rotateY");

            backgroundSeries.mapPolygons.template.set("fillOpacity", 0.1);
        }
    });

    cont.children.push(
        am5.Label.new(root, {
            centerY: am5.p50,
            text: "Globe"
        })
    );

// Create series for background fill
// https://www.amcharts.com/docs/v5/charts/map-chart/map-polygon-series/#Background_polygon
    var backgroundSeries = chart.series.push(am5map.MapPolygonSeries.new(root, {}));
    backgroundSeries.mapPolygons.template.setAll({
        fill: root.interfaceColors.get("alternativeBackground"),
        fillOpacity: 0,
        strokeOpacity: 0
    });

// Add background polygon
// https://www.amcharts.com/docs/v5/charts/map-chart/map-polygon-series/#Background_polygon
    backgroundSeries.data.push({
        geometry: am5map.getGeoRectangle(90, 180, -90, -180)
    });

// Create main polygon series for countries
// https://www.amcharts.com/docs/v5/charts/map-chart/map-polygon-series/
    var polygonSeries = chart.series.push(
        am5map.MapPolygonSeries.new(root, {
            geoJSON: am5geodata_worldLow
        })
    );


    polygonSeries.mapPolygons.template.setAll({
        tooltipText: "{name}",
        toggleKey: "active",
        interactive: true
    });

    polygonSeries.mapPolygons.template.states.create("hover", {
        fill: root.interfaceColors.get("primaryButtonHover")
    });

    polygonSeries.mapPolygons.template.states.create("active", {
        fill: root.interfaceColors.get("primaryButtonHover")
    });

// Create line series for trajectory lines
// https://www.amcharts.com/docs/v5/charts/map-chart/map-line-series/
    var lineSeries = chart.series.push(am5map.MapLineSeries.new(root, {}));
    lineSeries.mapLines.template.setAll({
        stroke: root.interfaceColors.get("alternativeBackground"),
        strokeOpacity: 0.3
    });

// Create point series for markers
// https://www.amcharts.com/docs/v5/charts/map-chart/map-point-series/
    var pointSeries = chart.series.push(am5map.MapPointSeries.new(root, {}));
    var colorset = am5.ColorSet.new(root, {});


    var previousPolygon;

    polygonSeries.mapPolygons.template.on("active", function (active, target) {
        if (previousPolygon && previousPolygon != target) {
            previousPolygon.set("active", false);
        }
        if (target.get("active")) {
            selectCountry(target.dataItem.get("id"));
        }
        previousPolygon = target;
    });

    function selectCountry(id) {
        var dataItem = polygonSeries.getDataItemById(id);
        var target = dataItem.get("mapPolygon");
        if (target) {
            if (target.get("active")) {
                polygonSeries.zoomToDataItem(target.dataItem );
            }
            else {
                chart.goHome();
            }
            traitementCountry(id);
            }

    }

    chart.chartContainer.get("background").events.on("click", function () {
        chart.goHome();
    })

// Make stuff animate on load
    chart.appear(1000, 100);
    createChart()
});