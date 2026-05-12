login: publicProcedure
  .input(z.object({
    email: z.string().email(),
    keyCode: z.string().min(4).max(8),
    name: z.string().optional(),
  }))
  .mutation(async ({ input }) => {
    const db = getDb();

    // Buscar la clave
    const [key] = await db.select().from(accessKeys).where(eq(accessKeys.keyCode, input.keyCode.toUpperCase()));
    if (!key) {
      return { success: false, message: 'Clave de acceso no válida' };
    }

    // Buscar usuario por email
    let [user] = await db.select().from(users).where(eq(users.email, input.email));

    // Si la clave ya está usada
    if (key.used) {
      // Si no hay usuario con ese email, error
      if (!user) {
        return { success: false, message: 'Esta clave ya fue utilizada por otro usuario. No puedes registrar un nuevo usuario con esta clave.' };
      }
      // Si el usuario existe pero no es el dueño de la clave, error
      if (key.usedByUserId !== user.id) {
        return { success: false, message: 'Esta clave ya fue utilizada por otro usuario.' };
      }
      // Si el usuario es el mismo que usó la clave, permitir login sin volver a marcar
      // (no es necesario actualizar la clave)
    } else {
      // Clave no usada: proceder con registro o login
      if (!user) {
        if (!input.name) {
          return { success: false, message: 'Necesitas registrarte. Ingresa tu nombre.' };
        }
        // Crear usuario
        const hashedPassword = await bcrypt.hash(input.keyCode, 10);
        const result = await db.insert(users).values({
          email: input.email,
          name: input.name,
          password: hashedPassword,
          role: 'user',
          isExcelAuthorized: true,
        });
        const userId = Number(result[0].insertId);
        [user] = await db.select().from(users).where(eq(users.id, userId));
      }
      // Marcar clave como usada por este usuario
      await db.update(accessKeys).set({ used: true, usedByUserId: user.id }).where(eq(accessKeys.id, key.id));
    }

    // Generar token
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
    return { success: true, token, user };
  }),

  logout: publicProcedure.mutation(async () => {
    return { success: true };
  }),
});
