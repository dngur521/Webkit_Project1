import AirHistList from './AirHistList';

export default function AirHistApp() {
    return (
        <div className="container">
            <div className="row my-4">
                <div className="col-md-8 offset-md-2 col-sm-10 offset-md-1">
                    <h1 className="text-center">에어컨 제어 기록</h1>
                    <AirHistList />
                </div>
            </div>
        </div>
    );
}
