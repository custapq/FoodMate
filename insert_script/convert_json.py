import json

def transform_food_data(food_json):
    transformed_data = {
        "thaiName": food_json["thaiName"],
        "englishName": food_json["englishName"],
        "imageURL": food_json["imageURL"],
        "Nutrients": {},
        "Foodtag": food_json["Category"].split(",")
    }
    
    nutrient_keys = [
        "energy", "water", "protein", "fat", "carbohydrate", "fiber", "ash",
        "calcium", "phosphorus", "magnesium", "sodium", "potassium", "iron", "copper", "zinc", "iodine",
        "beta-carotene", "retinol", "vitamin-A", "thiamin", "riboflavin", "niacin", "vitamin-C", "vitamin-E", "sugar"
    ]
    
    for key in nutrient_keys:
        if key in food_json:
            transformed_data["Nutrients"][key] = food_json[key]
    
    return transformed_data

def process_json_file(input_file, output_file):
    with open(input_file, "r", encoding="utf-8") as file:
        food_data_list = json.load(file)
    
    transformed_list = [transform_food_data(food) for food in food_data_list]
    
    with open(output_file, "w", encoding="utf-8") as file:
        json.dump(transformed_list, file, indent=4, ensure_ascii=False)
    
    print(f"Transformed data saved to {output_file}")

# ตัวอย่างการใช้งาน
if __name__ == "__main__":
    input_file = "food_data.json"  # เปลี่ยนเป็นชื่อไฟล์ของคุณ
    output_file = "transformed_food_data.json"  # ไฟล์ผลลัพธ์
    process_json_file(input_file, output_file)