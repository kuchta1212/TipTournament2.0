namespace TipTournament2._0.Utils
{
    using System;
    using System.Security.Cryptography;
    using System.Text;

    public static class RecoveryCodeGenerator
    {
        // Ambiguity-free alphabet: no 0/O, 1/I/L, U/V pairs.
        // 32 chars = 5 bits per char.
        private const string Alphabet = "ABCDEFGHJKMNPQRSTWXYZ23456789";

        // Generates a code of the form "tip-XXXX-XXXX-XXXX" (3 groups of 4).
        // ~60 bits of entropy — plenty for a friend-pool reset secret.
        public static string Generate()
        {
            const int groups = 3;
            const int groupLen = 4;
            const int totalChars = groups * groupLen;

            var bytes = new byte[totalChars];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(bytes);
            }

            var sb = new StringBuilder("tip-");
            for (int i = 0; i < totalChars; i++)
            {
                sb.Append(Alphabet[bytes[i] % Alphabet.Length]);
                if ((i + 1) % groupLen == 0 && i != totalChars - 1)
                {
                    sb.Append('-');
                }
            }
            return sb.ToString();
        }
    }
}
