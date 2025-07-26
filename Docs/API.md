PlantMon-AdvX API 文档

这是一个用于识别植物、生成艺术图片和详细信息的服务。
基础信息

- 服务地址:
- 内容类型: application/json

---

Profile定义数据格式
{
"latin_name": "{latin_name}", //植物拉丁名
"nickname": "", //基于植物的幻想生物描述的昵称
"common_name": "植物的常用中文名",
"rarity": "根据植物的真实珍稀程度，在'常见', '少见', '珍稀'中选择一个",
"trait": "总结一个四个字的特性，如'喜光耐湿', '剧毒致死', '夜间绽放'",
"description": "一个关于该植物的科普介绍，简单有趣，并且在最后一句话说出其幻想生物的名称-
'对应的宝可梦是xxx'",
"skills": [
{ "name": "基于植物形态或习性，创造一个不超过4个字的技能名称" },
{ "name": "第二个技能名称" }
],
"stats": {{
"hp": NUM, //0-100
"attack": NUM, //0-100
"defense": NUM, //0-100
"evasion": NUM, //0-100
"speed": NUM //0-100
}
}

---

接口列表

1. 健康检查

检查服务的运行状态。

- Endpoint: /health
- Method: GET
- 请求参数: 无
- 成功响应 (200 OK):
- JSON
  {
  "status": "healthy",
  "service": "PlantMon-AdvX"
  }

2. 获取所有植物列表

获取数据库中已记录的所有植物的拉丁名称列表。

- Endpoint: /plants
- Method: GET
- 请求参数: 无
- 成功响应 (200 OK):
- JSON
  {
  "success": true,
  "count": 15,
  "latin_names": [
  "Acer palmatum",
  "Aloe vera",
  "Ficus lyrata",
  "Monstera deliciosa",
  "Rosa damascena"
  ]
  }
- 失败响应 (500 Internal Server Error):
- JSON
  {
  "error": "Database connection failed",
  "message": "Unable to connect to database"
  }

3. 获取指定植物信息

根据植物的拉丁名称，获取其详细信息。

- Endpoint: /plants/<latin_name>
- Method: GET
- 路径参数:
  - latin_name (string, 必需): 植物的拉丁名称，需要进行 URL 编码 (例如, Rosa damascena 应编码为 Rosa%20damascena)。
- 查询参数:
  - info (string, 可选): 用于指定返回的数据范围。
    - all (默认): 返回所有信息，包括图片 URL、去背图片 URL、档案详情等。
    - profile: 仅返回植物档案 (profile)。
    - no_bg_image_url: 仅返回去背图片的 URL (no_bg_image_url)。
    - image_url: 仅返回原始生成图片的 URL (image_url)。
- 成功响应 (200 OK, info=all):
- JSON
  {
  "success": true,
  "data": {
  "latin_name": "Rosa damascena",
  "image_url": "http://<host>/static/images/Rosa_damascena.png",
  "no_bg_image_url": "http://<host>/static/images/Rosa_damascena_no_bg.png",
  "profile": {
  "nickname": "大马士革玫瑰",
  "family": "蔷薇科",
  "genus": "蔷薇属",
  "description": "一种以其浓郁香气而闻名的古典玫瑰...",
  "maintenance_tips": {
  "sunlight": "全日照",
  "watering": "保持土壤湿润但避免积水",
  "soil": "肥沃、排水良好的壤土",
  "fertilizer": "生长期每月施一次均衡肥"
  }
  },
  "created_at": "2024-07-25T10:30:00",
  "updated_at": "2024-07-25T10:30:00"
  }
  }
- 失败响应 (404 Not Found):
- JSON
  {
  "error": "Plant not found",
  "message": "No plant found with Latin name: Rosa%20damascena"
  }

4. 处理植物图片

这是核心功能接口。上传一张植物图片，服务将进行识别、生成新的艺术图和植物档案，并将结果存入数据库后返回。

- Endpoint: /process
- Method: POST
- 请求格式: multipart/form-data
- 请求体:
  - image (file, 必需): 需要识别的植物图片文件。
- 处理流程:
  1. 识别植物: 使用 GPT-4o 识别图片中的植物，获取拉丁名称。
  2. 查询缓存: 检查数据库中是否已存在该植物的数据。如果存在，直接返回数据库中的数据。
  3. 生成图片和档案: 如果是新植物，则生成风格化图片和详细档案。
  4. 保存并返回: 将新生成的数据存入数据库并返回给客户端。
- 成功响应 (200 OK - 首次处理):
- JSON
  {
  "success": true,
  "message": "Plant processed successfully",
  "name": "大马士革玫瑰",
  "image_url": "http://<host>/static/images/Rosa_damascena.png",
  "from_database": false,
  "no_bg_image_url": "http://<host>/static/images/Rosa_damascena_no_bg.png",
  "profile_json": {
  "nickname": "大马士革玫瑰",
  "family": "蔷薇科",
  "genus": "蔷薇属",
  "description": "..."
  }
  }
- 成功响应 (200 OK - 从数据库获取):
- JSON
  {
  "success": true,
  "message": "Plant data found in database",
  "name": "大马士革玫瑰",
  "plant_identification": {
  "latin_name": "Rosa damascena",
  "common_name": "Damask Rose",
  "confidence": 0.98,
  "plant_part": "flower"
  },
  "image_url": "http://<host>/static/images/Rosa_damascena.png",
  "from_database": true,
  "no_bg_image_url": "http://<host>/static/images/Rosa_damascena_no_bg.png",
  "profile_json": { ... }
  }
- 失败响应 (400 Bad Request):
  - 如果上传的不是植物:
  - JSON
    {
    "error": "Not a plant",
    "message": "The provided image does not appear to contain a plant"
    }
  - 如果识别的可信度过低:
  - JSON
    {
    "error": "Low confidence identification",
    "message": "Plant identification confidence is too low (< 0.50)"
    }
