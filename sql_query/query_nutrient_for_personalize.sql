SELECT 
    u.id AS user_id,
    u.email,
    DATE(r."timeStamp") AS date,
    SUM(CASE WHEN n."name" = 'protein' THEN nl.amount ELSE 0 END) AS protein_total,
    SUM(CASE WHEN n."name" = 'fat' THEN nl.amount ELSE 0 END) AS fat_total,
    SUM(CASE WHEN n."name" = 'carbohydrate' THEN nl.amount ELSE 0 END) AS carbohydrate_total,
    SUM(CASE WHEN n."name" IN ('vitaminA', 'thiamin', 'riboflavin') THEN nl.amount ELSE 0 END) AS vitamin_total,
    SUM(CASE WHEN n."name" IN ('calcium', 'phosphorus', 'magnesium', 'sodium', 'potassium', 'iron', 'copper', 'zinc', 'iodine') THEN nl.amount ELSE 0 END) AS mineral_total,
    SUM(CASE WHEN n."name" = 'water' THEN nl.amount ELSE 0 END) AS water_total
FROM "user" u
JOIN "recommendation" r ON u.id = r."userId"
JOIN "foodRecommendation" fr ON r.id = fr."recommendationId"
JOIN "food" f ON fr."foodId" = f.id
JOIN "nutrientList" nl ON f.id = nl."foodId"
JOIN "nutrient" n ON nl."nutrientId" = n.id
GROUP BY u.id, u.email, DATE(r."timeStamp")
ORDER BY u.id, date;
