import geopandas as gpd

# 读取 GeoJSON 数据文件
gdf = gpd.read_file('./json/shanghai.geojson')

# 对几何体进行简化，tolerance 控制简化程度
tolerance = 0.001  # 调整 tolerance 值以获得不同程度的简化
gdf['geometry'] = gdf['geometry'].simplify(tolerance, preserve_topology=True)

# 将简化后的 GeoDataFrame 保存为新的 GeoJSON 文件
gdf.to_file('simplified_geojson_file.geojson', driver='GeoJSON')
