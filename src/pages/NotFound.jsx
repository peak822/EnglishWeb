import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="container text-center py-20">
    <h1 className="text-gradient text-3xl font-bold">ไม่พบหน้านี้</h1>
    <p className="my-4">ตรวจสอบที่อยู่หน้าเว็บ หรือกลับไปเลือกกิจกรรมจากหน้าแรก</p>
    <Link to="/" className="ui-btn ui-btn-primary inline-block">กลับหน้าแรก</Link>
  </div>
);

export default NotFound;
