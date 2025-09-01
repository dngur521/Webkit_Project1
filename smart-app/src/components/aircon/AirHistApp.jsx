import AirHistList from './AirHistList';

export default function AirHistApp() {
    return (
        <div className="container">
            <div className="row my-4">
                <div>
                    <h1 className="text-center">에어컨 제어 기록</h1>
                    <AirHistList />
                </div>
            </div>
        </div>
    );
}
