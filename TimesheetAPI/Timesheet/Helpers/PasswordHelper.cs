using System.Security.Cryptography;
using System.Text;

namespace Timesheet.Helpers
{
    public static class PasswordHelper
    {
        private static readonly char[] chars =
         "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".ToCharArray();

        public static string GenerateSalt(int size = 6)
        {
            var random = new Random();
            var salt = new char[size];
            for (int i = 0; i < size; i++)
            {
                salt[i] = chars[random.Next(chars.Length)];
            }
            return new string(salt);
        }

        public static string HashPassword(string password, string salt)
        {
            using var sha256 = System.Security.Cryptography.SHA256.Create();
            var combined = System.Text.Encoding.UTF8.GetBytes(password + salt);
            var hash = sha256.ComputeHash(combined);
            return Convert.ToBase64String(hash);
        }
    }
}
