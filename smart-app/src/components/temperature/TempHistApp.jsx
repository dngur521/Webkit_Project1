import TempHistList from './TempHistList';

export default function AirHistApp() {
    return (
        <div className="container">
            <div className="row my-4">
                <div>
                    <h1 className="text-center">온습도 기록</h1>
                    <TempHistList />
                </div>
            </div>
        </div>
    );
}
