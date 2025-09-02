namespace Timesheet.Helpers
{
    public static class GeoHelper
    {
        public static double GetDistanceInMeters(double lat1, double lon1, double lat2, double lon2)
        {
            const double R = 6371000; // earth radius in meters
            var latRad1 = Math.PI * lat1 / 180.0;
            var latRad2 = Math.PI * lat2 / 180.0;
            var deltaLat = Math.PI * (lat2 - lat1) / 180.0;
            var deltaLon = Math.PI * (lon2 - lon1) / 180.0;

            var a = Math.Sin(deltaLat / 2) * Math.Sin(deltaLat / 2) +
                    Math.Cos(latRad1) * Math.Cos(latRad2) *
                    Math.Sin(deltaLon / 2) * Math.Sin(deltaLon / 2);

            var c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));
            return R * c;
        }
    }
}
