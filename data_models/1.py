import joblib

# 加载保存的对象
obj = joblib.load('lgbm_model_fare.joblib')

# 查看对象的内容
print(obj)
