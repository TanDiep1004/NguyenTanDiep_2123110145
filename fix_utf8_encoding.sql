-- Set MySQL character sets to UTF-8
SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

-- Fix Products table Vietnamese text
UPDATE products SET 
name = 'Kính Râm Ray-Ban Aviator Classic RB3025 G-15',
description = 'Biểu tượng kính phi công Ray-Ban gọng kim loại mạ vàng sang trọng, tròng kính G-15 chống 100% tia UV400.',
content = 'Chất liệu gọng: Titanium mạ vàng, Kích thước: 58-14-135, Xuất xứ: Ý'
WHERE id IN (1, 101);

UPDATE products SET 
name = 'Gọng Kính Cận Gucci Square Acetate Frame Gold',
description = 'Gọng kính vuông Gucci sang trọng tôn vinh đường nét khuôn mặt, đính kèm logo GG mạ vàng quyến rũ.',
content = 'Chất liệu gọng: Acetate & Kim loại mạ vàng, Kích thước: 53-17-140, Xuất xứ: Ý'
WHERE id IN (2, 104);

UPDATE products SET 
name = 'Kính Râm Gentle Monster Her 01 Oversized Black',
description = 'Mẫu kính râm Oversized làm mưa làm gió từ thương hiệu Hàn Quốc Gentle Monster, tròng kính Zeiss chống chói.',
content = 'Chất liệu gọng: Black Acetate, Kích thước: 65-15-147, Xuất xứ: Hàn Quốc'
WHERE id IN (3, 107);

UPDATE products SET 
name = 'Kính Mát Oakley Holbrook Matte Black Prizm Sapphire',
description = 'Mẫu kính mát thể thao Oakley Holbrook gọng đen nhám cá tính, trang bị tròng Prizm Sapphire giảm chói.',
content = 'Chất liệu gọng: O Matter siêu nhẹ, Kích thước: 57-18-137, Xuất xứ: Mỹ'
WHERE id IN (4, 110);

UPDATE products SET 
name = 'Gọng Kính Cận Ray-Ban Wayfarer Classic RB2140 Black',
description = 'Gọng kính cận Wayfarer huyền thoại với chất liệu Acetate đen nhám siêu bền, kiểu dáng cá tính mạnh mẽ.',
content = 'Chất liệu gọng: Acetate cao cấp, Kích thước: 50-22-150, Xuất xứ: Ý'
WHERE id IN (6, 102);

UPDATE products SET 
name = 'Gọng Kính Cận Ray-Ban Clubmaster Round Optics RX5154',
description = 'Thiết kế Clubmaster nửa gọng cổ điển pha lẫn hiện đại, phù hợp cho cả nam và nữ văn phòng.',
content = 'Chất liệu gọng: Hợp kim & Acetate, Kích thước: 51-21-145, Xuất xứ: Ý'
WHERE id = 103;

UPDATE products SET 
name = 'Kính Râm Gucci Cat-Eye Sunglasses GG0061S',
description = 'Dáng kính mát mắt mèo Cat-Eye thời thượng từ nhà mốt Gucci Ý, mang lại vẻ quý phái đẳng cấp.',
content = 'Chất liệu gọng: Acetate cao cấp, Kích thước: 56-18-145, Xuất xứ: Ý'
WHERE id = 105;

UPDATE products SET 
name = 'Gọng Kính Cận Gucci Oval Metal Optics Titanium',
description = 'Khung kính oval chất liệu Titanium siêu nhẹ màu vàng kim, độ bền cực cao không phai màu.',
content = 'Chất liệu gọng: Titanium nguyên khối, Kích thước: 52-19-145, Xuất xứ: Ý'
WHERE id = 106;

UPDATE products SET 
name = 'Gọng Kính Cận Gentle Monster South Side N01 Acetate',
description = 'Gọng kính vuông South Side góc cạnh nam tính, phù hợp cho khuôn mặt tròn và trái xoan.',
content = 'Chất liệu gọng: Acetate siêu bóng, Kích thước: 48-21-152, Xuất xứ: Hàn Quốc'
WHERE id = 108;

UPDATE products SET 
name = 'Gọng Kính Cận Gentle Monster Lilit 01 Bold Transparent',
description = 'Gọng kính trong suốt mờ Lilit thời trang phá cách, mang đến phong cách trẻ trung năng động.',
content = 'Chất liệu gọng: Transparent Acetate, Kích thước: 52-20-149, Xuất xứ: Hàn Quốc'
WHERE id = 109;

UPDATE products SET 
name = 'Gọng Kính Cận Thể Thao Oakley Crosslink Pitch Grey',
description = 'Gọng kính cận thể thao ôm sát khuôn mặt, đệm tai chống trượt Unobtainium bám chắc khi vận động.',
content = 'Chất liệu gọng: O Matter & Unobtainium, Kích thước: 54-18-140, Xuất xứ: Mỹ'
WHERE id = 111;

UPDATE products SET 
name = 'Kính Mát Thể Thao Oakley Radar EV Path Prizm Road',
description = 'Kính mát thể thao đường trường chuyên nghiệp cho cua-rơ và vận động viên điền kinh.',
content = 'Chất liệu gọng: Light O Matter, Kích thước: Free size, Xuất xứ: Mỹ'
WHERE id = 112;

-- Fix Categories table Vietnamese text
UPDATE categories SET name = 'Gọng Kính Nam', description = 'Bộ sưu tập gọng kính cận nam thời trang lịch lãm' WHERE id = 1;
UPDATE categories SET name = 'Gọng Kính Nữ', description = 'Bộ sưu tập gọng kính cận nữ xinh xắn tôn dáng mặt' WHERE id = 2;
UPDATE categories SET name = 'Kính Râm Thời Trang', description = 'Kính mát chống tia UV400 cao cấp bảo vệ mắt' WHERE id = 3;

-- Fix Brands table Vietnamese text
UPDATE brands SET name = 'Ray-Ban', description = 'Thương hiệu kính râm và gọng kính biểu tượng nổi tiếng thế giới từ Ý' WHERE id = 1;
UPDATE brands SET name = 'Gucci', description = 'Thương hiệu thời trang xa xỉ với các mẫu gọng kính thiết kế tinh xảo' WHERE id = 2;
UPDATE brands SET name = 'Gentle Monster', description = 'Thương hiệu kính mắt phá cách cao cấp đến từ Hàn Quốc' WHERE id = 3;
UPDATE brands SET name = 'Oakley', description = 'Thương hiệu kính thể thao chuyên nghiệp với tròng Prizm siêu nét' WHERE id = 4;
