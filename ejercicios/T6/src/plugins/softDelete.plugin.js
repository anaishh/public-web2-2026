/**
 * T6: Plugin de Soft Delete para Mongoose
 */

export const softDeletePlugin = (schema) => {
  // Añadir campos al schema
  schema.add({
    deleted: { type: Boolean, default: false, index: true },
    deletedAt: { type: Date, default: null },
    deletedBy: { type: String, default: null }
  });

  // Middleware: excluir eliminados en consultas por defecto
  const excludeDeleted = function() {
    // Permitir incluir eliminados con .setOptions({ withDeleted: true })
    if (!this.getOptions().withDeleted) {
      this.where({ deleted: { $ne: true } });
    }
  };

  schema.pre('find', excludeDeleted);
  schema.pre('findOne', excludeDeleted);
  schema.pre('findOneAndUpdate', excludeDeleted);
  schema.pre('countDocuments', excludeDeleted);

  // Método de instancia: soft delete
  schema.methods.softDelete = async function(deletedBy = null) {
    this.deleted = true;
    this.deletedAt = new Date();
    this.deletedBy = deletedBy;
    return this.save();
  };

  // Método de instancia: restaurar
  schema.methods.restore = async function() {
    this.deleted = false;
    this.deletedAt = null;
    this.deletedBy = null;
    return this.save();
  };

  // Método estático: soft delete por ID
  schema.statics.softDeleteById = async function(id, deletedBy = null) {
    return this.findByIdAndUpdate(
      id,
      {
        deleted: true,
        deletedAt: new Date(),
        deletedBy
      },
      { new: true }
    ).setOptions({ withDeleted: true });
  };

  // Método estático: restaurar por ID
  schema.statics.restoreById = async function(id) {
    return this.findByIdAndUpdate(
      id,
      {
        deleted: false,
        deletedAt: null,
        deletedBy: null
      },
      { new: true }
    ).setOptions({ withDeleted: true });
  };

  // Método estático: buscar incluyendo eliminados
  schema.statics.findWithDeleted = function(filter = {}) {
    return this.find(filter).setOptions({ withDeleted: true });
  };

  // Método estático: buscar solo eliminados (papelera)
  schema.statics.findDeleted = function(filter = {}) {
    return this.find({ ...filter, deleted: true }).setOptions({ withDeleted: true });
  };

  // Método estático: hard delete
  schema.statics.hardDelete = function(id) {
    return this.findByIdAndDelete(id).setOptions({ withDeleted: true });
  };

  // Método estático: vaciar papelera
  schema.statics.emptyTrash = function() {
    return this.deleteMany({ deleted: true });
  };

  // Método estático: eliminar expirados (más de X días)
  schema.statics.deleteExpired = async function(days = 30) {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() - days);

    return this.deleteMany({
      deleted: true,
      deletedAt: { $lt: expirationDate }
    });
  };
};
