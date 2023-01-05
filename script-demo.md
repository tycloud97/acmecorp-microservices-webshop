# Intro
Sau đây thì mình sẽ chia sẻ kiến thức về distributed tracing
Các bạn đã nhìn thấy slide chưa nhỉ?
Thông qua phần chia sẻ của anh Hoàng và anh Linh thì mọi người đã hiểu được vấn đề.
Microservices, truy vết lỗi, hành động của người dùng

# Content

Giới thiệu Distributed tracing
Cách hoạt động
Demo cách hoạt động và lấy ra các log liên quan tới request gửi email

# Distributed tracing là gì?

Là phương thức để truy vết cách request hoặc message đi qua hệ thống phân quán
Ví dụ: Dịch vụ này gọi dịch vụ kia.
Phù hợp cho các mô hình sự phụ thuộc phức tạp
Tập trung các log liên quan để dễ dàng debug lỗi
Giảm sự phức tạp
Tập trung các công việc business

## Ví dụ về bệnh nhân covid 17
Giới thiệu về từ truy vết, điều tra bệnh nhân covid...
Ví dụ bệnh nhân đi qua các quốc gia.
Đúng ko ạ?
Truy vết dựa vào đâu?
Những cách này áp dụng vào đời sống
Đối với các ứng dụng phức tạp thì sao?

Giới thiệu mô hình Microservices?
Gồm rất nhiều thành phần con để tăng sự linh hoạt cho hệ thống và chia nhỏ dễ quản lý
Kể ra các bất lợi trong hệ thống microservices như theo dõi

Đặt ví dụ về bài toán xảy ra nếu request bị lỗi
Không lẽ tôi phải vào từng service request để xem? Rồi xem như thế nào?

## Correct
Định danh cho các request tương tự bài toán truy vết (Tương tự)

Quay lại bài toán lúc nãy
Ví dụ là 1 kỹ sư ở twitter


Hãy để tôi tôi vào log của hàng trăm service và lấy những dòng log nó mention tới uesr id
id bài viết, người subscribe và gom nó lại thành một chỗ để điều tra
nó đi như thế nào trong hệ thống của chúng ta?
Điều tra tại sao nó không xuất hiện trên timeline

Đặt câu hỏi:
Sẽ thế nào nếu log không chứa những thông tin cần tìm?

Điều này được ví như mò kim đáy bể
Việc này rất là phổ biến nếu anh chị em đã từng làm các hệ thống...

Log có khối lượng rất lớn, một hệ thống có hàng trăm GB

## Correlation id
Cách hoạt động là tag tất cả các message liên quan
Nhược điểm thì sẽ log sẽ dài hơn


## Cách hoạt động
Giới thiệu cách hoạt động với HTTPS request
Giúp nhận biết từ request từ bên gọi tới bên nhận
Tương tự với các dịch vụ trong AWS
SNS
Kinesis
Khá tương đồng với các vấn đề đời sống
Tập trung lại một chỗ dễ dàng truy vết

## AWS X-RAY
Giới thiệu về AWS, cung cấp rất nhiều giải pháp về giải quyết các vấn đề MS
Khái niệm X-RAY, rất tiện dung

Use case:
Trace request đảm bảo an toàn bảo mật do AWS
Identify boottlenext và nơi có độ trễ cao để improve performance
Giảm thiểu sự rời rạc của dữ liệu, cung cấp thông tin để cải thiện người dùng
Debug ứng dụng serverless realtime

## Cách sử dụng 
Enable Lambda 
Bên trong đó làm gì nhưng nó đã sẵn sàng?
Đối với các hệ thống bên ngoài thì X-RAY demon

Mục đích bạn đầu
Sử dụng SDK?
Mở rộng hơn 1 chút?
Capture request HTTPS?

## Các thành phần
Trace
Annotation
Sampling (Giá)

## Demo
Mở giao diện AWS Console
Mở CloudWatch? Show các parameter
Chủ yếu vấn đề debug.
Nó không hoạt động với cái cũ 
Sử dụng EventDriven
Sử dụng cái Middleware dùng chung cho toàn bộ các Lambda function và gắn correlation id?
Show việc service này gọi service khác như nào?
Lấy cái ảnh ra
Về source code đẩy lên Github?

Demo vẫn nhập sai thông tin
Demo nhập đúng thông tin 
Lượn một vòng giao diện?

Có rất nhiều sự tương đồng với mô hình lúc nãy
Tỉ lệ lỗi 100%

Tác vụ mẫu? Đo hiệu suất?
Do hệ thống quá phức tạp

Giới thiệu parent id
Tận dụng khả năng


[17:29] Ty. Nguyen Huu - CMC Global CSC
Bài toán đòi hỏi anh em pháp hiểu nghiệp vụ trước khi debug? Tuỳ thuộc vào nghiệp vụ anh em có thể trace theo các hình thức khác nhau, không nhất thiết phải x-cor id?
Nếu mọi người đang expect X-Ray hiển thị ra thác nước thì không?
Mục đích mình truyền anotation ở mỗi lần gọi nó sẽ dễ nhận biết nếu nó không nằm chung một trace thì vẫn tìm ra được chứ không phải.
Do X-RAY group các tiến trình cùng lần gọi lại với nhau nên rất khó để mọi người đọc từ A->Z

Dự án thực tế
Ví dụ ngân hàng
Là giải pháp manage
Nhớ để log đúng vô?
Chi phí?
Đối với Minolith thì dễ
Thử với trường hợp thành công để xem nó từ A-Z?




