window.CODE_QUESTIONS = {
  "meta": {
    "total": 20,
    "totalBlanks": 331
  },
  "questions": [
    {
      "id": "1.1.1",
      "cells": [
        {
          "text": "import pandas as pd\nimport numpy as np\n\n# 读取数据集 1分\ndata = _____________",
          "answers": [
            "pd.read_csv('patient_data.csv')"
          ]
        },
        {
          "text": "# 1. 统计住院天数超过7天的患者数量及其占比\n# 创建新列'RiskLevel'，根据住院天数判断风险等级 3分\n_____________ = _____________(_____________, '高风险患者', '低风险患者')\n# 统计不同风险等级的患者数量 2分\nrisk_counts = data_____________._____________\n# 计算高风险患者占比 1分\nhigh_risk_ratio = risk_counts['高风险患者'] / _____________\n# 计算低风险患者占比 1分\nlow_risk_ratio = risk_counts['低风险患者'] / _____________\n\n# 输出结果\nprint(\"高风险患者数量:\", risk_counts['高风险患者'])\nprint(\"低风险患者数量:\", risk_counts['低风险患者'])\nprint(\"高风险患者占比:\", high_risk_ratio)\nprint(\"低风险患者占比:\", low_risk_ratio)",
          "answers": [
            "data['RiskLevel']",
            "np.where",
            "data['DaysInHospital'] > 7",
            "['RiskLevel']",
            "value_counts()",
            "len(data)",
            "len(data)"
          ]
        },
        {
          "text": "# 2. 统计不同BMI区间中高风险患者的比例和统计不同BMI区间中的患者数\n# 定义BMI区间和标签\nbmi_bins = [0, 18.5, 24, 28, np.inf]\nbmi_labels = ['偏瘦', '正常', '超重', '肥胖']\n# 根据BMI值划分指定区间 4分\ndata['BMIRange'] = _____________(_____________, _____________, _____________, right=False)  # 使用左闭右开区间\n# 计算每个BMI区间中高风险患者的比例 2分\nbmi_risk_rate = _____________(_____________)['RiskLevel'].apply(lambda x: (x == '高风险患者').mean())\n# 统计每个BMI区间的患者数量 1分\nbmi_patient_count = data_____________\n\n# 输出结果\nprint(\"BMI区间中高风险患者的比例和患者数:\")\nprint(bmi_risk_rate) \nprint(bmi_patient_count)",
          "answers": [
            "pd.cut",
            "data['BMI']",
            "bins=bmi_bins",
            "labels=bmi_labels",
            "data.groupby",
            "'BMIRange'",
            "['BMIRange'].value_counts()"
          ]
        },
        {
          "text": "# 3. 统计不同年龄区间中高风险患者的比例和统计不同年龄区间中的患者数\n# 定义年龄区间和标签\nage_bins = [0, 26, 36, 46, 56, 66, np.inf]\nage_labels = ['≤25岁', '26-35岁', '36-45岁', '46-55岁', '56-65岁', '＞65岁']\n# 根据年龄值划分指定区间 4分\ndata['AgeRange'] = _____________(_____________, _____________, _____________, right=False)  # 使用左闭右开区间\n# 计算每个年龄区间中高风险患者的比例 2分\nage_risk_rate = _____________(_____________)['RiskLevel'].apply(lambda x: (x == '高风险患者').mean())\n# 统计每个年龄区间的患者数量 1分\nage_patient_count = data_____________\n\n# 输出结果\nprint(\"年龄区间中高风险患者的比例和患者数:\")\nprint(age_risk_rate) \nprint(age_patient_count) ",
          "answers": [
            "pd.cut",
            "data['Age']",
            "bins=age_bins",
            "labels=age_labels",
            "data.groupby",
            "'AgeRange'",
            "['AgeRange'].value_counts()"
          ]
        }
      ]
    },
    {
      "id": "1.1.2",
      "cells": [
        {
          "text": "import pandas as pd\nimport numpy as np\nimport matplotlib.pyplot as plt\n# 读取数据集 2分\ndata = _____________",
          "answers": [
            "pd.read_csv('sensor_data.csv')"
          ]
        },
        {
          "text": "# 1. 传感器数据统计\n# 对传感器类型进行分组，并计算每个组的数据数量和平均值 3分\nsensor_stats = _____________(_____________)['Value']._____________\n# 输出结果\nprint(\"传感器数据数量和平均值:\")\nprint(sensor_stats)",
          "answers": [
            "data.groupby",
            "'SensorType'",
            "agg(['count','mean'])"
          ]
        },
        {
          "text": "# 2. 按位置统计温度和湿度数据\n# 筛选出温度和湿度数据，然后按位置和传感器类型分组，计算每个组的平均值 2分\nlocation_stats = data[data['SensorType']._____________._____________['Value'].mean().unstack()\n# 输出结果\nprint(\"每个位置的温度和湿度数据平均值:\")\nprint(location_stats)",
          "answers": [
            "isin(['Temperature','Humidity'])]",
            "groupby(['Location','SensorType'])"
          ]
        },
        {
          "text": "# 3. 数据清洗和异常值处理\n# 标记异常值 3分\ndata['is_abnormal'] = _____________(\n    ((_____________) & ((data['Value'] < -10) | (data['Value'] > 50))) |\n    ((_____________) & ((data['Value'] < 0) | (data['Value'] > 100))),\n    True, False\n)\n# 输出异常值数量 2分\nprint(\"异常值数量:\", data['is_abnormal']._____________)\n# 填补缺失值\n# 使用前向填充和后向填充的方法填补缺失值 4分\ndata['Value']._____________(_____________, inplace=True)\ndata['Value']._____________(_____________, inplace=True)\n# 保存清洗后的数据\n# 删除用于标记异常值的列，并将清洗后的数据保存到新的CSV文件中 4分\ncleaned_data = _____________(_____________=['is_abnormal'])\n_____________('cleaned_sensor_data.csv', _____________)\nprint(\"数据清洗完成，已保存为 'cleaned_sensor_data.csv'\")",
          "answers": [
            "np.where",
            "data['SensorType']=='Temperature'",
            "data['SensorType']=='Humidity'",
            "sum()",
            "fillna",
            "method='ffill'",
            "fillna",
            "method='ffill'",
            "data.drop",
            "columns",
            "cleaned_data.to_csv",
            "index=False"
          ]
        }
      ]
    },
    {
      "id": "1.1.3",
      "cells": [
        {
          "text": "import pandas as pd\nimport numpy as np\nimport matplotlib.pyplot as plt\n# 读取数据集\ndata = pd.read_csv('credit_data.csv')",
          "answers": []
        },
        {
          "text": "# 1. 数据完整性审核\nmissing_values = data._________       #数据缺失值统计 2分\nduplicate_values = data._________     #数据重复值统计 2分\n# 输出结果\nprint(\"缺失值统计:\")\nprint(missing_values)\nprint(\"重复值统计:\")\nprint(duplicate_values)",
          "answers": [
            "isnull().sum()",
            "duplicated().sum()"
          ]
        },
        {
          "text": "# 2. 数据合理性审核\ndata['is_age_valid'] = _________._________(18, 70)              #Age数据的合理性审核 2分\ndata['is_income_valid'] = _________ > _________                 #Income数据的合理性审核 2分\ndata['is_loan_amount_valid'] = _________ < (_________ * 5)      #LoanAmount数据的合理性审核 2分\ndata['is_credit_score_valid'] = _________._________(300, 850)   #CreditScore数据的合理性审核 2分\n# 合理性检查结果\nvalidity_checks = data[['is_age_valid', 'is_income_valid', 'is_loan_amount_valid', 'is_credit_score_valid']].all(axis=1)\ndata['is_valid'] = validity_checks\n# 输出结果\nprint(\"数据合理性检查:\")\nprint(data[['is_age_valid', 'is_income_valid', 'is_loan_amount_valid', 'is_credit_score_valid', 'is_valid']].describe())",
          "answers": [
            "data['Age']",
            "between",
            "data['Income']",
            "2000",
            "data['LoanAmount']",
            "data['Income']",
            "data['CreditScore']",
            "between"
          ]
        },
        {
          "text": "# 3. 数据清洗和异常值处理\n# 标记不合理数据\ninvalid_rows = data[~data['is_valid']]\n# 删除不合理数据行\ncleaned_data = data[data['is_valid']]\n# 删除标记列\ncleaned_data = cleaned_data.drop(columns=['is_age_valid', 'is_income_valid', 'is_loan_amount_valid', 'is_credit_score_valid', 'is_valid'])\n# 保存清洗后的数据\n_________._________(_________, index=False)\nprint(\"数据清洗完成，已保存为 'cleaned_credit_data.csv'\")",
          "answers": [
            "cleaned_data",
            "to_csv",
            "'cleaned_credit_data.csv'"
          ]
        }
      ]
    },
    {
      "id": "1.1.4",
      "cells": [
        {
          "text": "import pandas\nimport numpy as np\nimport matplotlib.pyplot as plt\n\n# 1. 数据采集\n# 从本地文件中读取数据  2分\ndata =  _______________________________\nprint(\"数据采集完成，已加载到DataFrame中\")\n\n# 打印数据的前5条记录  2分\nprint(________________________________)",
          "answers": [
            "pandas.read_csv('user_behavior_data.csv')",
            "\"数据采集完成，已加载到DataFrame中\""
          ]
        },
        {
          "text": "# 2. 数据清洗与预处理\n# 处理缺失值（删除）  2分\ndata = ________________________________\n\n# 数据类型转换\ndata________________ = ________________(int)   # Age数据类型转换为int 2分\ndata________________ = ________________(float) # PurchaseAmount数据类型转换为float  2分\ndata________________ = ________________(int)   # ReviewScore数据类型转换为int 2分\n\n# 处理异常值  2分\ndata = data[(________________.________________(18, 70)) & \n            (data['PurchaseAmount'] > 0) & \n            (________________.________________(1, 5))]\n\n# 数据标准化\ndata['PurchaseAmount'] = (data['PurchaseAmount'] - ________________) / ________________  # PurchaseAmount数据标准化 2分\ndata['ReviewScore'] = (data['ReviewScore'] - ________________) / ________________        # ReviewScore数据标准化 2分\n\n# 保存清洗后的数据  1分\n________________('cleaned_user_behavior_data.csv', index=False)\nprint(\"数据清洗完成，已保存为 'cleaned_user_behavior_data.csv'\")",
          "answers": [
            " pandas.read_csv('user_behavior_data.csv')",
            "['Age']",
            "data['Age'].astype",
            "['PurchaseAmount']",
            "data['PurchaseAmount'].astype",
            "['ReviewScore']",
            "data['ReviewScore'].astype",
            "data['Age']",
            "between",
            "data['ReviewScore']",
            "between",
            "data['PurchaseAmount'].mean()",
            "data['PurchaseAmount'].std()",
            "data['ReviewScore'].mean()",
            "data['ReviewScore'].std()",
            "data.to_csv"
          ]
        },
        {
          "text": "# 3. 数据统计\n# 统计每个购买类别的用户数 2分\npurchase_category_counts = ________________.________________\nprint(\"每个购买类别的用户数:\\n\", purchase_category_counts)\n\n# 统计不同性别的平均购买金额 2分\ngender_purchase_amount_mean = ________________(________________)['PurchaseAmount'].mean()\nprint(\"不同性别的平均购买金额:\\n\", gender_purchase_amount_mean)\n\n# 统计不同年龄段的用户数 2分\nbins = [18, 26, 36, 46, 56, 66, np.inf]\nlabels = ['18-25', '26-35', '36-45', '46-55', '56-65', '65+']\ndata['AgeGroup'] = pandas.________________(________________, right=False)\nage_group_counts = data['AgeGroup'].value_counts().sort_index()\nprint(\"不同年龄段的用户数:\\n\", age_group_counts)\n",
          "answers": [
            "data",
            "groupby('PurchaseCategory').size()",
            "data.groupby",
            "'Gender'",
            "cut",
            "data['Age'],bins=bins,labels=labels"
          ]
        }
      ]
    },
    {
      "id": "1.1.5",
      "cells": [
        {
          "text": "import pandas as pd\nimport numpy as np\nimport matplotlib.pyplot as plt\n\n# 1. 数据采集\n# 从本地文件中读取数据  2分\ndata = _____________\nprint(\"数据采集完成，已加载到DataFrame中\")\n\n# 打印数据的前5条记录 2分\nprint(_____________)",
          "answers": [
            "pd.read_csv('vehicle_traffic_data.csv')",
            "\"数据采集完成，已加载到DataFrame中\""
          ]
        },
        {
          "text": "# 2. 数据清洗与预处理\n# 处理缺失值（删除）  2分\ndata = _____________\n\n# 数据类型转换\ndata_____________ = _____________(int)       #Age数据类型转换为int 1分\ndata_____________ = _____________(float)     #Speed数据类型转换为float 1分\ndata_____________ = _____________(float)     #TravelDistance数据类型转换为float 1分\ndata_____________ = _____________(float)     #TravelTime数据类型转换为float 1分\n\n# 处理异常值  2分\ndata = data[(_____________(18, 70))  & \n            (_____________(0, 200)) & \n            (_____________(1, 1000)) & \n            (_____________(1, 1440))]\n\n# 保存清洗后的数据  1分\n_____________('cleaned_vehicle_traffic_data.csv', index=False)\nprint(\"数据清洗完成，已保存为 'cleaned_vehicle_traffic_data.csv'\")",
          "answers": [
            "pd.read_csv('vehicle_traffic_data.csv')",
            "['Age']",
            "data['Age'].astype",
            "['Speed']",
            "data['Speed'].astype",
            "['TravelDistance']",
            "data['TravelDistance'].astype",
            "['TravelTime']",
            "data['TravelTime'].astype",
            "data['Age'].between",
            "data['Speed'].between",
            "data['TravelDistance'].between",
            "data['TravelTime'].between",
            "data.to_csv"
          ]
        },
        {
          "text": "# 3. 数据合理性审核\n# 审核字段合理性 1分\nunreasonable_data = data[~((_____________(18, 70)) & \n                           (_____________(0, 200)) & \n                           (_____________(1, 1000)) & \n                           (_____________(1, 1440)))]\nprint(\"不合理的数据:\\n\", unreasonable_data)\n\n# 4. 数据统计\n# 统计每种交通事件的发生次数  2分\ntraffic_event_counts = _____________\nprint(\"每种交通事件的发生次数:\\n\", traffic_event_counts)\n\n# 统计不同性别的平均车速、行驶距离和行驶时间  2分\ngender_stats = data._____________._____________\nprint(\"不同性别的平均车速、行驶距离和行驶时间:\\n\", gender_stats)\n\n# 统计不同年龄段的驾驶员数  5分\nage_bins = [18, 26, 36, 46, 56, 66, np.inf]\nage_labels = ['18-25', '26-35', '36-45', '46-55', '56-65', '65+']\ndata['AgeGroup'] = _____________(_____________,_____________,_____________, right=False)\nage_group_counts = _____________\nprint(\"不同年龄段的驾驶员数:\\n\", age_group_counts)",
          "answers": [
            "data['Age'].between",
            "data['Speed'].between",
            "data['TravelDistance'].between",
            "data['TravelTime'].between",
            "data['TrafficEvent'].value_counts()",
            "groupby('Gender')[['Speed','TravelDistance','TravelTime']]",
            "mean()",
            "pd.cut",
            "data['Age']",
            " bins=age_bins",
            " labels=age_labels",
            "data['AgeGroup'].value_counts()"
          ]
        }
      ]
    },
    {
      "id": "2.1.1",
      "cells": [
        {
          "text": "import pandas as pd\n\n# 加载数据集并显示数据集的前五行 1分\ndata = __________\nprint(\"数据集的前五行:\")\nprint(__________)\n\n# 显示每一列的数据类型\nprint(data.dtypes)\n\n# 检查缺失值并删除缺失值所在的行  2分\nprint(\"\\n检查缺失值:\")\nprint(__________.__________.__________)  \ndata = __________\n\n# 将 'horsepower' 列转换为数值类型，并（删除）处理转换中的异常值 1分\ndata['horsepower'] = __________(data['horsepower'], errors='coerce')\ndata = __________\n\n# 显示每一列的数据类型\nprint(data.horsepower.dtypes)\n\n# 检查清洗后的缺失值\nprint(\"\\n检查清洗后的缺失值:\")\nprint(data.isnull().sum())\n\nfrom sklearn.preprocessing import StandardScaler\n# 对数值型数据进行标准化处理 1分\nnumerical_features = ['displacement', 'horsepower', 'weight', 'acceleration']\nscaler = StandardScaler()\ndata[numerical_features] = __________\n\nfrom sklearn.model_selection import train_test_split\n# 选择特征、自变量和目标变量 2分\nselected_features = __________\nX = __________\ny = __________\n\n# 划分数据集为训练集和测试集（训练集占8成） 1分\nX_train, X_test, y_train, y_test = __________(__________, random_state=42)\n\n\n# 将特征和目标变量合并到一个数据框中\ncleaned_data = X.copy()\ncleaned_data['mpg'] = y\n\n# 保存清洗和处理后的数据（不存储额外的索引号） 1分\n__________('2.1.1_cleaned_data.csv', __________)\n\n# 打印消息指示文件已保存\nprint(\"\\n清洗后的数据已保存到 2.1.1_cleaned_data.csv\")",
          "answers": [
            "pd.read_csv('auto-mpg.csv')",
            "\"数据集的前五行:\"",
            "data",
            "isnull()",
            "sum()",
            "pd.read_csv('auto-mpg.csv')",
            "pd.to_numeric",
            "pd.read_csv('auto-mpg.csv')",
            "scaler.fit_transform(data[numerical_features])",
            "['cylinders', 'displacement', 'horsepower', 'weight', 'acceleration', 'model year', 'origin']",
            "data[selected_features]",
            "data['mpg']",
            "train_test_split",
            "X, y, test_size=0.2",
            "cleaned_data.to_csv",
            "index=False"
          ]
        }
      ]
    },
    {
      "id": "2.1.2",
      "cells": [
        {
          "text": "import pandas as pd\n#读取一个Excel文件，并将读取到的数据存储在变量data中\ndata = __________\n#打印出数据集的前5行\nprint(data.head())\n\n#处理数据集中的缺失值\ninitial_row_count = __________   #处理前的数据行数\ndata = __________                #删除缺失值所在行\nfinal_row_count = __________     #处理后的数据行数\nprint(f'处理后数据行数: {final_row_count}, 删除的行数: {initial_row_count - final_row_count}')\n\n#删除重复行\ndata = __________\n\nfrom sklearn.preprocessing import StandardScaler\nnumerical_features = ['4.您的月生活费○≦1,000元   ○1,001-2,000元   ○2,001-3,000元   ○≧3,001元']\nscaler = StandardScaler()\ndata[numerical_features] = __________\n\n#选择特征\nselected_features = [__________]\nX = __________\n\n# 创建目标变量\ny = __________\n\nfrom sklearn.model_selection import train_test_split\n# 数据划分（测试集取20%）\nX_train, X_test, y_train, y_test = __________(__________, random_state=42)\n\n# 合并处理后得数据，并将其保存（保存中不用额外创建索引）\ncleaned_data = __________(__________, axis=1)\n__________('2.1.2_cleaned_data.csv', __________)",
          "answers": [
            "pd.read_excel('大学生低碳生活行为的影响因素数据集.xlsx')",
            "data.shape[0]",
            "data.dropna()",
            "data.shape[0]",
            "pd.read_excel('大学生低碳生活行为的影响因素数据集.xlsx')",
            "scaler.fit_transform(data[numerical_features])",
            "'1.您的性别○男性   ○女性', '2.您的年级○大一   ○大二   ○大三   ○大四', '3.您的生源地○农村   ○城镇（乡镇）   ○地县级城市  ○省会城市及直辖市', '4.您的月生活费○≦1,000元   ○1,001-2,000元   ○2,001-3,000元   ○≧3,001元', '5.您进行过绿色低碳的相关生活方式吗?', '6.您觉得\"低碳\"，与你的生活关系密切吗？', '7.低碳生活是否会成为未来的主流生活方式？', '8.您是否认为低碳生活会提高您的生活质量？'",
            "data[selected_features]",
            "data['低碳行为积极性']",
            "train_test_split",
            "X, y, test_size=0.2",
            "pd.concat",
            "[X_train, y_train]",
            "cleaned_data.to_csv",
            "index=False"
          ]
        }
      ]
    },
    {
      "id": "2.1.3",
      "cells": [
        {
          "text": "import pandas as pd\n\n# 加载数据\ndata = __________\n\n# 显示前五行的数据\n__________\n\nimport matplotlib.pyplot as plt\nimport seaborn as sns\n\n# 设置图像尺寸\nplt.figure(figsize=(12, 8))\n\n# 识别数值列用于箱线图\nnumeric_cols = data.select_dtypes(include=['float64', 'int64']).columns\n\n# 创建箱线图\nfor i, col in enumerate(numeric_cols, 1):\n    plt.subplot(3, 4, i)\n    sns.boxplot(x=data[col])\n    plt.title(col)\n\nplt.tight_layout()\nplt.show()\n\n# 使用IQR处理异常值\nQ1 = __________(0.25)\nQ3 = __________(0.75)\nIQR = __________\n\n# 移除异常值\ndata_cleaned = data[~((data[numeric_cols] < (Q1 - 1.5 * __________)) | (data[numeric_cols] > (Q3 + 1.5 * __________))).any(axis=1)]\n\n# 检查处理重复值\nduplicates = __________()\nnum_duplicates = duplicates.sum()\ndata_cleaned = data_cleaned[~duplicates]\n\nprint(f'删除的重复行数: {num_duplicates}')\n\n#对数据进行归一化处理\nfrom sklearn.preprocessing import MinMaxScaler\n\nscaler = MinMaxScaler()\ndata_cleaned[numeric_cols] = __________\n\n# 设定目标变量\ntarget_variable = __________\n\nfrom sklearn.model_selection import train_test_split\n\n# 定义特征和目标\nX = __________(columns=[__________])   #1分\ny = __________                         #1分\n\n# 划分数据（训练集占80%）\nX_train, X_test, y_train, y_test = __________(__________, random_state=42)\n\n# 显示划分后的数据形状\nprint(f'训练数据形状: {X_train.shape}')\nprint(f'测试数据形状: {X_test.shape}')\n\n# 保存清洗后的数据到CSV\ncleaned_file_path = '2.1.3_cleaned_data.csv'\n__________(__________, index=False)\n",
          "answers": [
            "pd.read_csv('finance数据集.csv')",
            "import pandas as pd",
            "data[numeric_cols].quantile",
            "data[numeric_cols].quantile",
            "Q3 - Q1",
            "IQR",
            "IQR",
            "data_cleaned.duplicated",
            "scaler.fit_transform(data_cleaned[numeric_cols])",
            "'SeriousDlqin2yrs'",
            "data_cleaned.drop",
            "target_variable",
            "data_cleaned[target_variable]",
            "train_test_split",
            "X, y, test_size=0.2",
            "data_cleaned.to_csv",
            "cleaned_file_path"
          ]
        }
      ]
    },
    {
      "id": "2.1.4",
      "cells": [
        {
          "text": "import pandas as pd\n\n# 加载数据集并指定编码为gbk\ndata = _________\n\n# 查看数据类型\nprint(data.dtypes)\n# 查看表结构基本信息\nprint(_________)\n\n# 显示每一列的空缺值数量\nprint(data.isnull().sum())\n\n# 规范日期格式\ndata['就诊日期'] = pd.to_datetime(data['就诊日期'])\ndata['诊断日期'] = pd.to_datetime(data['诊断日期'])\n\n# 修改列名\n_________(_________, inplace=True)\n\n# 查看修改后的表结构\nprint(data.head())\n\nfrom datetime import datetime\n\n# 增加诊断延迟和病程列\ndata['诊断延迟'] = _________.dt.days\ndata['病程'] = (datetime(2024, 9, 1) - data['诊断日期']).dt.days\n\n# 删除不合理的数据\ndata = _________[(_________ >= 0) & (_________ > 0) & (_________ < 120)]\n\n# 查看修改后的数据\nprint(data.describe())\n\n# 删除重复值并记录删除的行数\ninitial_rows = data.shape[0]\n_________(inplace=True)\ndeleted_rows = initial_rows - data.shape[0]\n\nprint(f'删除的重复行数: {deleted_rows}')\n\nfrom sklearn.preprocessing import MinMaxScaler\n\n# 对需要归一化的列进行处理\nscaler = MinMaxScaler()\ncolumns_to_normalize = [_________]\ndata[columns_to_normalize] = _________\n\n# 查看归一化后的数据\nprint(data.head())\n\nimport matplotlib.pyplot as plt\nimport matplotlib.font_manager as fm\n\n\n# 统计治疗结果分布\ntreatment_outcome_distribution = data.groupby('疾病类型')['治疗结果'].value_counts().unstack()\n\n# 设置中文字体\nfont_path = 'C:/Windows/Fonts/simhei.ttf'  # 根据你的系统调整字体路径\nmy_font = fm.FontProperties(fname=font_path)\n\n# 绘制柱状图\n_________(_________, stacked=True)\nplt.title('不同疾病类型的治疗结果分布', fontproperties=my_font)\nplt.xlabel('疾病类型', fontproperties=my_font)\nplt.ylabel('治疗结果数量', fontproperties=my_font)\nplt.xticks(fontproperties=my_font)  # 设置x轴刻度标签的字体\nplt.yticks(fontproperties=my_font)  # 设置y轴刻度标签的字体\nplt.legend(prop=my_font)  # 设置图例字体\nplt.show()\n\n# 绘制散点图\n_________(_________, _________)\nplt.title('年龄和疾病严重程度的关系', fontproperties=my_font)\nplt.xlabel('年龄', fontproperties=my_font)\nplt.ylabel('疾病严重程度', fontproperties=my_font)\nplt.xticks(fontproperties=my_font)  # 设置x轴刻度标签的字体\nplt.yticks(fontproperties=my_font)  # 设置y轴刻度标签的字体\nplt.legend(prop=my_font)  # 设置图例字体\nplt.show()\n\n# 保存处理后得数据\noutput_path = '2.1.4_cleaned_data.csv'\n_________(_________, index=False)",
          "answers": [
            "pd.read_csv('medical_data.csv', encoding='gbk')",
            "data.dtypes",
            "data.rename",
            "columns={'病人ID': '患者ID'}",
            "(data['诊断日期'] - data['就诊日期'])",
            "data",
            "data['诊断延迟']",
            "data['年龄']",
            "data['年龄']",
            "data.drop_duplicates",
            "'年龄', '体重', '身高'",
            "scaler.fit_transform(data[columns_to_normalize])",
            "treatment_outcome_distribution.plot",
            "kind='bar'",
            "data = pd.read_csv",
            "'medical_data.csv'",
            "encoding='gbk'",
            "data.to_csv",
            "output_path"
          ]
        }
      ]
    },
    {
      "id": "2.1.5",
      "cells": [
        {
          "text": "import pandas as pd\n\n# 加载数据集\ndata = __________\n\n# 查看表结构基本信息\nprint(__________)\n\n# 显示每一列的空缺值数量\nprint(__________)\n\n# 删除含有缺失值的行\ndata_cleaned = __________\n\n# 转换 'Your age' 列的数据类型为整数类型，并处理异常值\ndata_cleaned.loc[:, 'Your age'] = __________(__________, errors='coerce')\ndata_cleaned = data_cleaned.dropna(subset=['Your age'])\ndata_cleaned = data_cleaned[data_cleaned['Your age'] >= 0]\ndata_cleaned.loc[:, 'Your age'] = data_cleaned['Your age'].__________\n\nprint(data_cleaned['Your age'].dtype)\n\n# 检查和删除重复值\nduplicates_removed = data_cleaned.duplicated().sum()\ndata_cleaned = __________\n\nprint(f\"Removed {duplicates_removed} duplicate rows\")\n\nfrom sklearn.preprocessing import LabelEncoder\n\n# 归一化 'How do you describe your current level of fitness ?' 列\nlabel_encoder = LabelEncoder()\ndata_cleaned[__________] = __________\n\nprint(data_cleaned['How do you describe your current level of fitness ?'].unique())\n\nfrom sklearn.preprocessing import LabelEncoder\nimport matplotlib.pyplot as plt\n\n# 去掉列名中的空格\ndata.columns = data.columns.str.strip()\n# 显示数据集的列名\nprint(data.columns)\n\n# 删除包含缺失值的行\ndata_cleaned = data.dropna(subset=['How often do you exercise?'])\n\n# 统计不同健身频率的分布情况\nexercise_frequency_counts = data_cleaned['How often do you exercise?'].value_counts()\n\n# 绘制饼图\nplt.figure(figsize=(10, 6))\n__________(autopct='%1.1f%%', startangle=90, colors=plt.cm.Paired.colors)\nplt.title('Distribution of Exercise Frequency')\nplt.ylabel('')\nplt.show()\n\nimport pandas as pd\nfrom sklearn.model_selection import train_test_split\nimport matplotlib.pyplot as plt\n\n# 填充缺失值\ndata_filled = data.apply(lambda x: x.fillna(x.mode()[0]))\n\n# 划分数据（测试集占比20%）\ntrain_data, test_data = __________(__________, random_state=42)\n\n# 保存处理后的数据\ncleaned_file_path = '__________'\n__________(__________, index=False)\n",
          "answers": [
            "pd.read_csv('健康咨询客户数据集.csv')",
            "data.info()",
            "data.info()",
            "data.dropna()",
            "pd.to_numeric",
            "data_cleaned['Your age']",
            "astype(int)",
            "data.dropna()",
            "'How do you describe your current level of fitness ?'",
            "label_encoder.fit_transform(data_cleaned['How do you describe your current level of fitness ?'])",
            "exercise_frequency_counts.plot.pie",
            "train_test_split",
            "data_filled, test_size=0.2",
            "2.1.5_cleaned_data.csv",
            "train_data.to_csv",
            "cleaned_file_path"
          ]
        }
      ]
    },
    {
      "id": "2.2.1",
      "cells": [
        {
          "text": "import pandas as pd\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.linear_model import LogisticRegression\nimport pickle\nfrom sklearn.metrics import classification_report\nfrom imblearn.over_sampling import SMOTE\n\n# 加载数据\ndata = __________\n\n# 显示前五行的数据\nprint(__________)\n\n# 选择自变量和因变量\nX = data.drop(['SeriousDlqin2yrs', 'Unnamed: 0'], axis=1)\ny = data['SeriousDlqin2yrs']\n\n# 分割训练集和测试集（测试集20%）\nX_train, X_test, y_train, y_test = __________(__________, random_state=42)\n\n# 训练Logistic回归模型（最大迭代次数为1000次）\nmodel = __________\n#训练 Logistic 回归模型\n__________\n\n# 保存模型\nwith open('2.2.1_model.pkl', 'wb') as file:\n    pickle.__________\n\n# 预测并保存结果\ny_pred = __________\npd.DataFrame(y_pred, columns=['预测结果']).to_csv('2.2.1_results.txt', index=False)\n\n# 生成测试报告\nreport = classification_report(y_test, y_pred, zero_division=1)\nwith open('2.2.1_report.txt', 'w') as file:\n    file.write(report)\n\n# 分析测试结果\naccuracy = __________\nprint(f\"模型准确率: {accuracy:.2f}\")\n\n# 处理数据不平衡\nsmote = SMOTE(random_state=42)\nX_resampled, y_resampled = __________\n\n# 重新训练模型\n__________\n# 重新预测\ny_pred_resampled = __________\n\n# 保存新结果\npd.DataFrame(y_pred_resampled, columns=['预测结果']).to_csv('2.2.1_results_xg.txt', index=False)\n\n# 生成新的测试报告\nreport_resampled = classification_report(y_test, y_pred_resampled, zero_division=1)\nwith open('2.2.1_report_xg.txt', 'w') as file:\n    file.write(report_resampled)\n\n# 分析新的测试结果\naccuracy_resampled = __________\nprint(f\"重新采样后的模型准确率: {accuracy_resampled:.2f}\")\n",
          "answers": [
            "pd.read_csv('finance数据集.csv')",
            "data.head()",
            "train_test_split",
            "X, y, test_size=0.2",
            "LogisticRegression(max_iter=1000)",
            "import pandas as pd",
            "dump(model, file)",
            "model.predict(X_test)",
            "(y_test == y_pred).mean()",
            "smote.fit_resample(X_train, y_train)",
            "import pandas as pd",
            "model.predict(X_test)",
            "(y_test == y_pred_resampled).mean()"
          ]
        }
      ]
    },
    {
      "id": "2.2.2",
      "cells": [
        {
          "text": "import pandas as pd\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.linear_model import LinearRegression\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.pipeline import Pipeline\nimport pickle\nfrom sklearn.ensemble import RandomForestRegressor\n\n# 加载数据集\ndf = __________\n\n# 显示前五行数据\nprint(__________)\n\n# 处理缺失值\n# 将 'horsepower' 列中的所有值转换为数值类型\ndf['horsepower'] = __________(__________, errors='coerce')\n# 删除包含缺失值的行\ndf = __________\n\n# 选择相关特征进行建模（定义自变量（返回一个DataFrame）和因变量）\nX = __________\ny = __________\n\n# 将数据集划分为训练集和测试集（测试集占比20%）\nX_train, X_test, y_train, y_test = __________(__________, random_state=42)\n\n# 创建包含标准化和线性回归的管道\npipeline = __________([('scaler', __________),('linreg', __________)])\n\n# 训练模型\n__________\n\n# 保存训练好的模型\nwith open('2.2.2_model.pkl', 'wb') as model_file:\n    pickle.__________\n\n# 预测并保存结果\ny_pred = __________\nresults_df = pd.DataFrame(y_pred, columns=['预测结果'])\n__________('2.2.2_results.txt', index=False)\n\n# 测试模型\nwith open('2.2.2_report.txt', 'w') as results_file:\n    results_file.write(f'训练集得分: {pipeline.score(X_train, y_train)}\\n')\n    results_file.write(f'测试集得分: {pipeline.score(X_test, y_test)}\\n')\n\n# 创建随机森林回归模型实例（创建的决策树的数量为100）\nrf_model = __________(__________, random_state=42)\n# 训练随机森林回归模型\n__________\n\n# 使用随机森林模型进行预测\ny_pred_rf = __________\n\n# 保存新的结果\nresults_rf_df = pd.DataFrame(y_pred_rf, columns=['预测结果'])\n__________('2.2.2_results_rf.txt', index=False)\n\n# 测试模型并保存得分\nwith open('2.2.2_report_rf.txt', 'w') as results_rf_file:\n    results_rf_file.write(f'训练集得分: {rf_model.score(X_train, y_train)}\\n')\n    results_rf_file.write(f'测试集得分: {rf_model.score(X_test, y_test)}\\n')\n",
          "answers": [
            "pd.read_csv('auto-mpg.csv')",
            "df.head()",
            "pd.to_numeric",
            "df['horsepower']",
            "pd.read_csv('auto-mpg.csv')",
            "df[[ 'cylinders', 'displacement', 'horsepower', 'weight',",
            "df['mpg']",
            "train_test_split",
            "X, y, test_size=0.2",
            "Pipeline",
            "StandardScaler()",
            "LinearRegression()",
            "df.columns",
            "dump(pipeline, model_file)",
            "pipeline.predict(X_test)",
            "results_df.to_csv",
            "RandomForestRegressor",
            "n_estimators=100",
            "df.columns",
            "rf_model.predict(X_test)",
            "results_rf_df.to_csv"
          ]
        }
      ]
    },
    {
      "id": "2.2.3",
      "cells": [
        {
          "text": "import pandas as pd\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.ensemble import RandomForestRegressor\nimport pickle\nfrom sklearn.metrics import mean_squared_error, r2_score\nimport xgboost as xgb\n\n# 加载数据集\ndf = __________\n\n# 显示前五行数据\nprint(__________)\n\n# 去除所有字符串字段的前后空格\ndf = df.applymap(lambda x: x.strip() if isinstance(x, str) else x)\n\n# 检查和清理列名\ndf.columns = df.columns.str.strip()\n\n# 选择相关特征进行建模\nX = df[['Your gender', 'How important is exercise to you ?', 'How healthy do you consider yourself?']]\nX = __________(X, drop_first=True)  # 将分类变量转为数值变量\n\n# 将年龄段转为数值变量\ny = __________(lambda x: int(x.split(' ')[0]))  # 假设年龄段为整数\n\n# 将数据集划分为训练集和测试集（测试集占比20%）\nX_train, X_test, y_train, y_test = __________(__________, random_state=42)\n\n# 创建随机森林回归模型（创建的决策树的数量为100）\nrf_model = __________(__________, random_state=42)\n# 训练随机森林回归模型\n__________\n\n# 保存训练好的模型\nwith open('2.2.3_model.pkl', 'wb') as model_file:\n    pickle.__________\n\n# 进行结果预测\ny_pred = __________\nresults_df = pd.DataFrame(y_pred, columns=['预测结果'])\nresults_df.to_csv('2.2.3_results.txt', index=False)\n\n# 使用测试工具对模型进行测试，并记录测试结果\ntrain_score = __________   #训练集分数\ntest_score = __________    #测试集分数\nmse = __________  #均方误差\nr2 = __________  #决定系数\nwith open('2.2.3_report.txt', 'w') as report_file:\n    report_file.write(f'训练集得分: {train_score}\\n')\n    report_file.write(f'测试集得分: {test_score}\\n')\n    report_file.write(f'均方误差(MSE): {mse}\\n')\n    report_file.write(f'决定系数(R^2): {r2}\\n')\n\n# 运用工具分析算法中错误案例产生的原因并进行纠正\n# 初始化XGBoost回归模型（构建100棵树）\nxgb_model = __________(__________, random_state=42)\n# 训练XGBoost回归模型\n__________\n# 使用XGBoost回归模型在测试集上进行结果预测\ny_pred_xgb = __________\n\nresults_df_xgb = pd.DataFrame(y_pred_xgb, columns=['预测结果'])\nresults_df_xgb.to_csv('2.2.3_results_xgb.txt', index=False)\n\nwith open('2.2.3_report_xgb.txt', 'w') as xgb_report_file:\n    xgb_report_file.write(f'XGBoost训练集得分: {__________}\\n')\n    xgb_report_file.write(f'XGBoost测试集得分: {__________}\\n')\n    xgb_report_file.write(f'XGBoost均方误差(MSE): {__________}\\n')\n    xgb_report_file.write(f'XGBoost决定系数(R^2): {__________)}\\n')\n",
          "answers": [
            "pd.read_csv('fitness analysis.csv')",
            "df.head()",
            "pd.get_dummies",
            "df['Age'].apply",
            "train_test_split",
            "X, y, test_size=0.2",
            "RandomForestRegressor",
            "n_estimators=100",
            "import pandas as pd",
            "dump(rf_model, model_file)",
            "rf_model.predict(X_test)",
            "rf_model.score(X_train, y_train)",
            "rf_model.score(X_test, y_test)",
            "mean_squared_error(y_test, y_pred)",
            "r2_score(y_test, y_pred)",
            "xgb.XGBRegressor",
            "n_estimators=100",
            "import pandas as pd",
            "xgb_model.predict(X_test)",
            "xgb_model.score(X_train, y_train)",
            "xgb_model.score(X_test, y_test)",
            "mean_squared_error(y_test, y_pred_xgb)",
            "r2_score(y_test, y_pred_xgb"
          ]
        }
      ]
    },
    {
      "id": "2.2.4",
      "cells": [
        {
          "text": "import pandas as pd\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.linear_model import LinearRegression\nfrom sklearn.metrics import mean_squared_error, r2_score\nimport joblib\nfrom xgboost import XGBRegressor\n\n# 加载数据集\ndata = __________\n\n# 显示数据集的前五行\nprint(__________)\n\n# 删除不必要的列并处理分类变量\ndata_cleaned = __________(__________=['序号', '所用时间'])  # 删除不必要的列\ndata_cleaned = pd.get_dummies(data_cleaned, drop_first=True)  # 将分类变量转换为哑变量/指示变量\n\n# 定义目标变量和特征\ntarget = '5.您进行过绿色低碳的相关生活方式吗?'  # 确保这是目标变量\n\n# 定义自变量和因变量\nX = __________(__________=__________)\ny = __________\n\n# 将数据拆分为训练集和测试集（测试集占20%）\nX_train, X_test, y_train, y_test = __________(__________, random_state=42)\n\n# 初始化线性回归模型\nmodel = __________\n# 训练线性回归模型\n__________\n\n# 保存训练好的模型\nmodel_filename = '2.2.4_model.pkl'\njoblib.__________\n\n# 进行预测\ny_pred = __________\n\n# 将结果保存到文本文件中\nresults = pd.DataFrame({'实际值': y_test, '预测值': y_pred})\nresults_filename = '2.2.4_results.txt'\n__________(__________, index=False, sep='\\t')  # 使用制表符分隔值保存到文本文件\n\n# 将测试结果保存到报告文件中\nreport_filename = '2.2.4_report.txt'\nwith open(report_filename, 'w') as f:\n    f.write(f'均方误差: {__________}\\n')\n    f.write(f'决定系数: {__________}\\n')\n    \n# 分析并纠正错误（示例：使用XGBoost）\n# 初始化XGBoost模型（设定树的数量为1000，学习率为0.05，每棵树的最大深度为5，）\nxgb_model = __________(__________, subsample=0.8, colsample_bytree=0.8)\n# 训练XGBoost模型\n__________\n\n# 使用XGBoost模型进行预测\ny_pred_xg = __________\n\n# 将XGBoost结果保存到文本文件中\nresults_xg_filename = '2.2.4_results_xg.txt'\nresults_xg = pd.DataFrame({'实际值': y_test, '预测值': y_pred_xg})\nresults_xg.to_csv(results_xg_filename, index=False, sep='\\t')  # 使用制表符分隔值保存到文本文件\n\n# 将XGBoost测试结果保存到报告文件中\nreport_filename_xgb = '2.2.4_report_xgb.txt'\nwith open(report_filename_xgb, 'w') as f:\n    f.write(f'均方误差: {__________}\\n')\n    f.write(f'决定系数: {__________}\\n')\n",
          "answers": [
            "__________",
            "__________",
            "__________",
            "__________",
            "__________",
            "__________",
            "__________",
            "__________",
            "__________",
            "__________",
            "__________",
            "import pandas as pd",
            "__________",
            "__________",
            "__________",
            "__________",
            "__________",
            "__________",
            "__________",
            "__________",
            "import pandas as pd",
            "__________",
            "__________",
            "__________"
          ]
        }
      ]
    },
    {
      "id": "2.2.5",
      "cells": [
        {
          "text": "import pandas as pd\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.tree import DecisionTreeRegressor\nimport pickle\nfrom sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score\n\n# 加载数据集\ndf = __________\n\n# 显示前五行数据\nprint(__________)\n\n# 选择相关特征进行建模\nX = df[['Your gender ', 'How important is exercise to you ?', 'How healthy do you consider yourself?']]\nX = __________(X)  # 将分类变量转为数值变量\n\n# 设置目标变量\ny = __________  \n\n# 将数据集划分为训练集和测试集（测试集占20%）\nX_train, X_test, y_train, y_test = __________(__________, random_state=42)\n\n# 创建并训练决策树回归模型\n__________ = __________(random_state=42)\n# 训练决策树回归模型\n__________\n\n# 保存训练好的模型\nwith open('2.2.5_model.pkl', 'wb') as model_file:\n    pickle.__________\n\n# 进行预测\ny_pred = __________\n\n# 将结果保存到文本文件中\nresults = pd.DataFrame({'实际值': y_test, '预测值': y_pred})\nresults_filename = '2.2.5_results.txt'\n__________(__________, index=False, sep='\\t')  \n\n# 将测试结果保存到报告文件中\nreport_filename = '2.2.5_report.txt'\nwith open(__________) as f:\n    f.write(f'均方误差: {__________}\\n')\n    f.write(f'平均绝对误差: {__________}\\n')\n    f.write(f'决定系数: {__________}\\n')",
          "answers": [
            "__________",
            "__________",
            "__________",
            "__________",
            "__________",
            "__________",
            "__________",
            "__________",
            "import pandas as pd",
            "__________",
            "__________",
            "__________",
            "__________",
            "__________",
            "__________",
            "__________",
            "__________"
          ]
        }
      ]
    },
    {
      "id": "3.2.1",
      "cells": [
        {
          "text": "import onnxruntime as ort\nimport numpy as np\nimport scipy.special\nfrom PIL import Image\n\n\n# 预处理图像\ndef preprocess_image(image, resize_size=256, crop_size=224, mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]):\n  image = image.resize((resize_size, resize_size), Image.BILINEAR)\n  w, h = image.size\n  left = (w - crop_size) / 2\n  top = (h - crop_size) / 2\n  image = image.crop((left, top, left + crop_size, top + crop_size))\n  image = np.array(image).astype(np.float32)\n  image = image / 255.0\n  image = (image - mean) / std\n  image = np.transpose(image, (2, 0, 1))\n  image = image.reshape((1,) + image.shape)\n  return image\n\n\n# 模型加载 2分\nsession = _________________\n\n\n# 加载类别标签\nlabels_path = 'labels.txt'\nwith open(labels_path) as f:\n  labels = [line.strip() for line in f.readlines()]\n\n\n# 获取模型输入和输出的名称\ninput_name = session.get_inputs()[0].name\noutput_name = session.get_outputs()[0].name\n\n\n# 加载图片 2分\nimage = _________________('RGB')\n\n\n# 预处理图片 2分\nprocessed_image = _________________\n\n\n# 确保输入数据是 float32 类型\nprocessed_image = processed_image.astype(np.float32)\n\n\n# 进行图片识别 2分\noutput = _________________([output_name], {input_name: processed_image})[0]\n\n\n# 应用 softmax 函数获取概率 2分\nprobabilities = _________________(output, axis=-1)\n\n\n# 获取最高的5个概率和对应的类别索引 3分\ntop5_idx = _________________[-5:][::-1]\ntop5_prob = _________________\n\n\n# 打印结果\nprint(\"Top 5 predicted classes:\")\nfor i in range(5):\n  print(f\"{i+1}: {labels[top5_idx[i]]} - Probability: {top5_prob[i]}\")\n",
          "answers": [
            "ort.InferenceSession('resnet.onnx')",
            "Image.open('img_test.jpg').convert",
            "preprocess_image(image)",
            "session.run",
            "scipy.special.softmax",
            "np.argsort(probabilities[0])",
            "probabilities[0][top5_idx]"
          ]
        }
      ]
    },
    {
      "id": "3.2.2",
      "cells": [
        {
          "text": "import onnxruntime\nimport numpy as np\nfrom PIL import Image\n\n\n# 加载ONNX模型  2分\nort_session = __________________\n\n\n# 加载图像 2分\nimage = __________________('L')  # 转为灰度图\n\n\n#图像预处理 \nimage = __________________((28, 28))  # 调整大小为MNIST模型的输入尺寸2分\nimage_array = __________________(__________________, dtype=np.float32)  # 转为numpy数组2分\nimage_array = __________________(__________________, axis=0)  # 添加batch维度2分\nimage_array = __________________(__________________, axis=0)  # 添加通道维度2分\n\n\n#返回模型输入列表 2分\nort_inputs = {__________________()[0].name: image_array}\n# 执行预测 2分\nort_outs = __________________(None, ort_inputs)\n\n\n# 获取预测结果 2分\npredicted_class = __________________\n\n\n# 输出预测结果\nprint(f\"Predicted class: {predicted_class}\")\n",
          "answers": [
            "onnxruntime.InferenceSession('mnist.onnx')",
            "Image.open('img_test.png').convert",
            "image.resize",
            "np.asarray",
            "image",
            "np.expand_dims",
            "image_array",
            "np.expand_dims",
            "image_array",
            "ort_session.get_inputs",
            "ort_session.run",
            "np.argmax(ort_outs[0])"
          ]
        }
      ]
    },
    {
      "id": "3.2.3",
      "cells": [
        {
          "text": "# 导入必要的库\nimport numpy as np\nfrom PIL import Image\nimport onnxruntime as ort\n\n\n# 定义预处理函数，用于将图片转换为模型所需的输入格式\ndef preprocess(image_path):\n    input_shape = (1, 1, 64, 64)    # 模型输入期望的形状，这里是 (N, C, H, W)，N=batch size, C=channels, H=height, W=width\n    img = Image.open(image_path).convert('L')    # 打开图像文件并将其转换为灰度图  1分\n    img = img.resize((64, 64), Image.ANTIALIAS)    # 调整图像大小到模型输入所需的尺寸\n    img_data = np.array(img, dtype=np.float32)    # 将PIL图像对象转换为numpy数组，并确保数据类型是float32\n    # 调整数组的形状以匹配模型输入的形状\n    img_data = np.expand_dims(img_data, axis=0)  # 添加 batch 维度\n    img_data = np.expand_dims(img_data, axis=1)  # 添加 channel 维度\n    assert img_data.shape == input_shape, f\"Expected shape {input_shape}, but got {img_data.shape}\"    # 确保最终的形状与模型输入要求的形状一致\n    return img_data    # 返回预处理后的图像数据\n\n\n# 定义情感类别与数字标签的映射表 3分\nemotion_table = {____________}\n\n\n# 加载模型 3分\nort_session = ____________    # 使用onnxruntime创建一个会话，用于加载并运行模型\n\n\n# 加载本地图片并进行预处理 3分\ninput_data = ____________\n\n\n# 准备输入数据，确保其符合模型输入的要求\nort_inputs = {ort_session.get_inputs()[0].name: input_data}    # ort_session.get_inputs()[0].name 是获取模型的第一个输入的名字\n\n\n# 运行模型，进行预测 3分\nort_outs = ____________(None, ____________)\n\n\n# 解码模型输出，找到预测概率最高的情感类别 3分\npredicted_label = ____________(ort_outs[0])\n\n\n# 根据预测的标签找到对应的情感名称 3分\npredicted_emotion = ____________[predicted_label]\n\n\n# 输出预测的情感\nprint(f\"Predicted emotion: {predicted_emotion}\")\n",
          "answers": [
            "____________",
            "____________",
            "____________",
            "____________",
            "____________",
            "____________",
            "____________"
          ]
        }
      ]
    },
    {
      "id": "3.2.4",
      "cells": [
        {
          "text": "import onnxruntime as ort\nimport numpy as np\nimport scipy.special\nfrom PIL import Image\n\n\n# 预处理图像\ndef preprocess_image(image, resize_size=256, crop_size=224, mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]):\n    image = image.resize((resize_size, resize_size), Image.BILINEAR)\n    w, h = image.size\n    left = (w - crop_size) / 2\n    top = (h - crop_size) / 2\n    image = image.crop((left, top, left + crop_size, top + crop_size))\n    image = np.array(image).astype(np.float32)\n    image = image / 255.0\n    image = (image - mean) / std\n    image = np.transpose(image, (2, 0, 1))\n    image = image.reshape((1,) + image.shape)\n    return image\n\n\n# 加载模型  2分\nsession = _________________\n\n\n# 加载类别标签 2分\nwith _________________ as f:\n    labels = [line.strip() for line in f.readlines()]\n\n\n# 获取模型输入和输出的名称\ninput_name = session.get_inputs()[0].name\noutput_name = session.get_outputs()[0].name\n\n\n# 加载图片  2分\nimage = _________________('RGB')\n\n\n# 预处理图片  2分\nprocessed_image = _________________\n\n\n# 确保输入数据是 float32 类型\nprocessed_image = processed_image.astype(np.float32)\n\n\n# 进行图片识别  2分\noutput = _________________([output_name], {input_name: processed_image})[0]\n\n\n# 应用 softmax 函数获取识别分类后的准确率  2分\naccuracy = _________________(output, axis=-1)\n\n\n# 获取预测的类别索引\npredicted_idx =  __________\n\n\n# 获取预测的准确值（转换为百分比）\nprob_percentage =  __________\n\n\n# 获取预测的类别标签\npredicted_label = __________\n\n\n# 输出预测结果，包含百分比形式的概率\nprint(f\"Predicted class: {predicted_label}, Accuracy: {prob_percentage:.2f}%\")\n",
          "answers": [
            "_________________",
            "_________________",
            "_________________",
            "_________________",
            "_________________",
            "_________________",
            "__________",
            "__________",
            "__________"
          ]
        }
      ]
    },
    {
      "id": "3.2.5",
      "cells": [
        {
          "text": "import os\nimport time\nimport cv2\nimport numpy as np\nimport vision.utils.box_utils_numpy as box_utils\nimport onnxruntime as ort\n\n# 定义预测函数，对模型输出的边界框和置信度进行后处理\ndef predict(width, height, confidences, boxes, prob_threshold, iou_threshold=0.3, top_k=-1):\n    boxes = boxes[0]\n    confidences = confidences[0]\n    picked_box_probs = []\n    picked_labels = []\n    for class_index in range(1, confidences.shape[1]):\n        probs = confidences[:, class_index]\n        mask = probs > prob_threshold\n        probs = probs[mask]\n        if probs.shape[0] == 0:\n            continue\n        subset_boxes = boxes[mask, :]\n        box_probs = np.concatenate([subset_boxes, probs.reshape(-1, 1)], axis=1)\n        box_probs = box_utils.hard_nms(box_probs,\n                                       iou_threshold=iou_threshold,\n                                       top_k=top_k,\n                                       )\n        picked_box_probs.append(box_probs)\n        picked_labels.extend([class_index] * box_probs.shape[0])\n    if not picked_box_probs:\n        return np.array([]), np.array([]), np.array([])\n    picked_box_probs = np.concatenate(picked_box_probs)\n    picked_box_probs[:, 0] *= width\n    picked_box_probs[:, 1] *= height\n    picked_box_probs[:, 2] *= width\n    picked_box_probs[:, 3] *= height\n    return picked_box_probs[:, :4].astype(np.int32), np.array(picked_labels), picked_box_probs[:, 4]\n\n# 从标签文件中读取每一行，并去除行首尾的空白字符，得到类别名称列表 2分\nclass_names = [_______________ for name in open('voc-model-labels.txt').readlines()]\n\n# 创建 ONNX Runtime 的推理会话，用于运行模型进行推理 2分\nort_session = _______________('version-RFB-320.onnx')\n\n# 获取模型输入的名称 2分\ninput_name = _______________()[0].name\n\n# 定义保存检测结果图像的目录路径\nresult_path = \"./detect_imgs_results_onnx\"\n\n# 定义置信度阈值，用于筛选出置信度较高的检测结果\nthreshold = 0.7\n# 定义存储待检测图像的目录路径\npath = \"imgs\"\n# 用于统计所有图像中检测到的目标框总数，初始化为 0\nsum = 0\n\n# 如果保存结果的目录不存在，则创建该目录 2分\nif not os.path.exists(result_path):\n    os._______________\n    \n# 获取指定目录下的所有文件和文件夹名称列表\nlistdir = os.listdir(path)\n\n# 遍历目录下的每个文件\nfor file_path in listdir:\n    # 拼接图像文件的完整路径\n    img_path = os.path.join(path, file_path)\n    # 使用 OpenCV 读取图像文件 2分\n    orig_image = _______________\n    # 将图像从 BGR 颜色空间转换为 RGB 颜色空间（许多模型要求输入为 RGB 格式）\n    image = cv2.cvtColor(orig_image, cv2.COLOR_BGR2RGB)\n    # 将图像调整为 320x240 的尺寸（符合模型输入的尺寸要求） 2分\n    image = _______________(_______________, (320, 240))\n    # 定义图像归一化的均值数组 2分\n    image_mean = _______________([127, 127, 127])\n    # 对图像进行归一化处理，减去均值并除以 128\n    image = (image - image_mean) / 128\n    # 将图像的维度从 (高度, 宽度, 通道数) 转换为 (通道数, 高度, 宽度)\n    image = np.transpose(image, [2, 0, 1])\n    # 在第一个维度上扩展一个维度，将图像变为 (1, 通道数, 高度, 宽度)，以符合模型输入的维度要求  1分\n    image = _______________(image, axis=0)\n    # 将图像数据类型转换为 float32 类型\n    image = image.astype(np.float32)\n    # 记录开始时间，用于计算模型推理的耗时\n    time_time = time.time()\n    # 使用 ONNX Runtime 运行模型，输入图像数据，得到模型输出的置信度和边界框  2分\n    confidences, boxes = _______________(None, {input_name: image})\n    # 计算并打印模型推理的耗时\n    print(\"cost time:{}\".format(time.time() - time_time))\n    # 调用 predict 函数对模型输出的边界框和置信度进行后处理，得到最终的边界框、类别标签和置信度\n    boxes, labels, probs = predict(orig_image.shape[1], orig_image.shape[0], confidences, boxes, threshold)\n    # 遍历每个检测到的目标框\n    for i in range(boxes.shape[0]):\n        # 获取当前目标框的坐标\n        box = boxes[i, :]\n        # 生成当前目标框的标签字符串，包含类别名称和置信度\n        label = f\"{class_names[labels[i]]}: {probs[i]:.2f}\"\n\n        # 在原始图像上绘制目标框，颜色为 (255, 255, 0)，线条粗细为 4\n        cv2.rectangle(orig_image, (box[0], box[1]), (box[2], box[3]), (255, 255, 0), 4)\n        # 将绘制了目标框的图像保存到结果目录中\n        cv2.imwrite(os.path.join(result_path, file_path), orig_image)\n    # 累加当前图像中检测到的目标框数量到总数中\n    sum += boxes.shape[0]\n# 打印所有图像中检测到的目标框总数\nprint(\"sum:{}\".format(sum))",
          "answers": [
            "_______________",
            "_______________",
            "_______________",
            "path.exists(result_path):",
            "_______________",
            "_______________",
            "_______________",
            "_______________",
            "_______________",
            "_______________"
          ]
        }
      ]
    }
  ]
};
