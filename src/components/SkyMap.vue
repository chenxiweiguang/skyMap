<script setup>
import {ref} from "vue"

const data= ref({
        map: {},
        longitude: 116.403963,
        latitude: 39.915119,
        inputLocation: ''
        })
console.log(data.value.latitude)
load()

function load() {
    const init = new Promise((resolve, reject) => {
        if(window.T) {
            console.log('地图初始化成功')
            resolve(window.T)
            reject('error')
                }
        })
        let zoom=12;
    init.then(T => {
            data.map = new T.Map('map');
            data.map.centerAndZoom(new T.LngLat(116.40769, 39.89945), zoom);

            let control = new T.Control.Zoom();
            //添加缩放平移控件
            // control.setPosition(T_ANCHOR_TOP_LEFT);
            data.map.addControl(control);

            //创建比例尺控件对象
            let scale = new T.Control.Scale();
            scale.setPosition(T_ANCHOR_TOP_RIGHT);
            //添加比例尺控件
            data.map.addControl(scale);

            let miniMap = new T.Control.OverviewMap({
                isOpen: true,
                size: new T.Point(150, 150)
            });
            miniMap.setPosition(T_ANCHOR_TOP_RIGHT);
            data.map.addControl(miniMap);

            let military = new T.Control.militarySymbols({ position: T_ANCHOR_TOP_LEFT});
            data.map.addControl(military);
    
            //切换地图图层
            // const ctrl = new T.Control.MapType([
            //     {
            //     title: "地图", //地图控件上所要显示的图层名称
            //     icon: "http://api.tianditu.gov.cn/v4.0/image/map/maptype/vector.png", //地图控件上所要显示的图层图标（默认图标大小80x80）
            //     layer: TMAP_NORMAL_MAP //地图类型对象，即MapType。
            //     },
            //     {
            //     title: "卫星混合",
            //     icon:
            //         "http://api.tianditu.gov.cn/v4.0/image/map/maptype/satellitepoi.png",
            //     layer: TMAP_HYBRID_MAP
            //     }
            // ]); 
            const ctrl = new T.Control.MapType();
            data.map.addControl(ctrl);

              //创建右键菜单对象
              var menu = new T.ContextMenu({width: 140});
            //添加右键菜单

            var txtMenuItem = [
                {
                    text: '放大',
                    callback: function () {
                        data.map.zoomIn()
                    }
                },
                {
                    text: '缩小',
                    callback: function () {
                        data.map.zoomOut()
                    }
                },
                {
                    text: '放置到最大级',
                    callback: function () {
                        data.map.setZoom(18)
                    }
                },
                {
                    text: '查看全国',
                    callback: function () {
                        data.map.setZoom(4)
                    }
                },
                {
                    text: '获得右键点击处坐标',
                    isDisable: false,
                    callback: function (lnglat) {
                        alert(lnglat.getLng() + "," + lnglat.getLat());
                    }
                }
            ];
            
            for (var i = 0; i < txtMenuItem.length; i++) {

                //添加菜单项
                var item = new T.MenuItem(txtMenuItem[i].text, txtMenuItem[i].callback);
                //item.disable();
                menu.addItem(item);
                if (i == 1 || i == 3) {
                    //添加分割线
                    menu.addSeparator();
                }
            }
            data.map.addContextMenu(menu);
        
        })      
        }

function handleAddPoint() {
        data.map.clearOverLays(); //清空原来的标注点
        let point = new T.LngLat(data.value.longitude,data.value.latitude)
        //将地图的中心点变换到输入的地理位置，同时缩放到指定等级
        data.map.centerAndZoom(new T.LngLat(data.value.longitude,data.value.latitude), 12);
        let marker = new T.Marker(point)
        data.map.addOverLay(marker) //添加标注点
        //点击标注点事件，添加信息窗口
        let markerInfoWin = new T.InfoWindow("信息窗口");
        marker.addEventListener('click', function() {
             marker.openInfoWindow(markerInfoWin);
        })
    }

function handleFindLocation() {
    let geocoder = new T.Geocoder()
    let that = data
    function searchResult(result){
        if(result.getStatus() == 0){
            //将地图的中心点变换到输入的地理位置，同时缩放到指定等级
            that.map.panTo(result.getLocationPoint(), 16);
            //创建标注对象
            let marker = new T.Marker(result.getLocationPoint());
            //向地图上添加标注
            that.map.addOverLay(marker);
        }else{
            alert(result.getMsg());
        }        
    }
    geocoder.getPoint(data.value.inputLocation, searchResult);
}

//地图注册点击事件
function addMapClick()
	{
		removeMapClick();
		data.map.addEventListener("click",MapClick);
	}

	function removeMapClick()
	{
		data.map.removeEventListener("click",MapClick);
	}
	
	function MapClick(e)
	{
		// alert(e.lnglat.getLng()+","+e.lnglat.getLat());
        data.value.longitude=e.lnglat.getLng();
        data.value.latitude=e.lnglat.getLat();

	}


</script>

<template>
    <div id="map"></div>
    <div>经度：</div><el-input style="width: 100px; margin-right: 10px" v-model="data.longitude" placeholder="Input longitude" clearable />
    <div>纬度：</div><el-input style="width: 100px; margin-right: 10px" v-model="data.latitude" placeholder="Input latitude" clearable />
    <el-button type="primary" @click="handleAddPoint">添加标注点</el-button>
    
    <div style="display: flex">
    <div>地名：</div><el-input  style="width: 300px; margin-right: 10px" v-model="data.inputLocation" @keyup.enter.native="handleFindLocation"></el-input>
    <el-button type="primary" @click="handleFindLocation">搜索</el-button>
    </div>
    <div>
		地图点击事件：
		<input type="button" value="注册" @click="addMapClick"/>
		<input type="button" value="移除" @click="removeMapClick"/>
	</div>
</template>

<style scoped>
#map {
    width: 900px;
    height: 600px;
    
}

</style>
